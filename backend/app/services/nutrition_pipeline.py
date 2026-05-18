import os
import re
from dataclasses import dataclass
from pathlib import Path
from statistics import mean
from typing import Any


class NutritionPipelineError(Exception):
    """Error yang aman ditampilkan ke user frontend."""


@dataclass(frozen=True)
class DetectedTable:
    crop: Any
    confidence: float | None


_yolo_model = None
_ocr_reader = None


def _project_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _model_path() -> Path:
    raw_path = os.getenv("NUTRITION_YOLO_MODEL")
    if raw_path:
        return Path(raw_path)
    return _project_root() / "models" / "nutrition_table_yolo.pt"


def _load_yolo_model():
    global _yolo_model
    if _yolo_model is not None:
        return _yolo_model

    model_path = _model_path()
    if not model_path.exists():
        raise NutritionPipelineError(
            f"Model YOLO belum ditemukan di {model_path}. "
            "Salin file best.pt ke backend/models/nutrition_table_yolo.pt."
        )

    from ultralytics import YOLO

    _yolo_model = YOLO(str(model_path))
    return _yolo_model


def _load_ocr_reader():
    global _ocr_reader
    if _ocr_reader is not None:
        return _ocr_reader

    import easyocr

    use_gpu = os.getenv("EASYOCR_GPU", "false").lower() in {"1", "true", "yes"}
    _ocr_reader = easyocr.Reader(["en", "id"], gpu=use_gpu)
    return _ocr_reader


def _select_best_box(result):
    boxes = result.boxes
    if boxes is None or len(boxes) == 0:
        raise NutritionPipelineError(
            "Tabel nutrisi tidak terdeteksi. Coba foto ulang dengan label lebih jelas dan tidak terpotong."
        )

    xyxy = boxes.xyxy.cpu().numpy()
    confidences = boxes.conf.cpu().numpy() if boxes.conf is not None else [None] * len(xyxy)

    best_index = 0
    best_score = -1.0
    for index, box in enumerate(xyxy):
        x1, y1, x2, y2 = box
        area = max(0.0, x2 - x1) * max(0.0, y2 - y1)
        confidence = float(confidences[index]) if confidences[index] is not None else 1.0
        score = area * confidence
        if score > best_score:
            best_index = index
            best_score = score

    confidence = confidences[best_index]
    return xyxy[best_index], float(confidence) if confidence is not None else None


def _detect_table(image_path: Path) -> DetectedTable:
    model = _load_yolo_model()
    results = model.predict(source=str(image_path), conf=0.1, imgsz=640, verbose=False)
    if not results:
        raise NutritionPipelineError("Gambar tidak bisa diproses oleh model YOLO.")

    result = results[0]
    box, confidence = _select_best_box(result)
    image = result.orig_img
    height, width = image.shape[:2]

    x1, y1, x2, y2 = box
    padding = 8
    left = max(0, int(x1) - padding)
    top = max(0, int(y1) - padding)
    right = min(width, int(x2) + padding)
    bottom = min(height, int(y2) + padding)

    if right <= left or bottom <= top:
        raise NutritionPipelineError("Area tabel nutrisi yang terdeteksi tidak valid.")

    crop = image[top:bottom, left:right]
    return DetectedTable(crop=crop, confidence=confidence)


def _preprocess_for_ocr(crop):
    import cv2

    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    height, width = gray.shape[:2]
    scale = 2 if max(height, width) < 1400 else 1
    if scale > 1:
        gray = cv2.resize(gray, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    return cv2.bilateralFilter(gray, 7, 50, 50)


def _read_text(crop) -> tuple[list[str], float | None]:
    reader = _load_ocr_reader()
    processed = _preprocess_for_ocr(crop)
    results = reader.readtext(processed, detail=1, paragraph=False)

    text_parts: list[str] = []
    confidences: list[float] = []
    for item in results:
        if len(item) < 2:
            continue
        text_parts.append(str(item[1]))
        if len(item) >= 3:
            try:
                confidences.append(float(item[2]))
            except (TypeError, ValueError):
                pass

    if not text_parts:
        raise NutritionPipelineError(
            "Tabel nutrisi terdeteksi, tetapi teks belum terbaca. Coba foto yang lebih tajam."
        )

    return text_parts, mean(confidences) if confidences else None


def _normalize_text(text_parts: list[str]) -> str:
    raw_text = " ".join(text_parts).lower()
    replacements = {
        "\n": " ",
        "\r": " ",
        "|": " ",
        ":": " ",
        ";": " ",
        "kkai": "kkal",
        "kcai": "kcal",
        "enerqi": "energi",
        "ener9i": "energi",
        "natriurn": "natrium",
    }
    for source, target in replacements.items():
        raw_text = raw_text.replace(source, target)
    return re.sub(r"\s+", " ", raw_text).strip()


def _to_float(value: str | None) -> float | None:
    if value is None:
        return None
    cleaned = value.replace(",", ".")
    try:
        return float(cleaned)
    except ValueError:
        return None


def _first_number(patterns: list[str], text: str) -> float | None:
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            value = _to_float(match.group(1))
            if value is not None:
                return value
    return None


def _extract_nutrition(text: str) -> dict[str, float | None]:
    energy = _first_number(
        [
            r"(?:ener[gq]i|energy|kalori|calories)[^0-9]{0,80}(\d+(?:[\.,]\d+)?)\s*(?:kkal|kcal)?",
            r"(\d+(?:[\.,]\d+)?)\s*(?:kkal|kcal)",
        ],
        text,
    )
    sugar = _first_number(
        [
            r"(?:gula\s*total|gula|sugar)[^0-9]{0,60}(\d+(?:[\.,]\d+)?)\s*g?",
        ],
        text,
    )
    sodium = _first_number(
        [
            r"(?:natrium|sodium|garam|salt)[^0-9]{0,80}(\d+(?:[\.,]\d+)?)\s*mg?",
        ],
        text,
    )
    saturated_fat = _first_number(
        [
            r"(?:lemak\s*jenuh|saturated\s*fat|sat\.?\s*fat)[^0-9]{0,80}(\d+(?:[\.,]\d+)?)\s*g?",
        ],
        text,
    )
    serving_size = _first_number(
        [
            r"(?:takaran\s*saji|serving\s*size|sajian)[^0-9]{0,80}(\d+(?:[\.,]\d+)?)\s*(?:ml|m?g|g)?",
        ],
        text,
    )

    return {
        "energy": energy,
        "sugar": sugar,
        "sodium": sodium,
        "saturated_fat": saturated_fat,
        "serving_size": serving_size,
    }


def _round_or_none(value: float | None, digits: int = 2) -> float | None:
    if value is None:
        return None
    return round(value, digits)


def _per_100(value: float | None, serving_size: float | None) -> float | None:
    if value is None or serving_size is None or serving_size <= 0:
        return None
    return (value / serving_size) * 100


def _score_sugar(value: float | None) -> str | None:
    if value is None:
        return None
    if value > 10:
        return "D"
    if value > 5:
        return "C"
    if value > 1:
        return "B"
    return "A"


def _score_sodium(value: float | None) -> str | None:
    if value is None:
        return None
    if value > 500:
        return "D"
    if value > 120:
        return "C"
    if value > 5:
        return "B"
    return "A"


def _score_saturated_fat(value: float | None) -> str | None:
    if value is None:
        return None
    if value > 500:
        return "D"
    if value > 120:
        return "C"
    if value > 5:
        return "B"
    return "A"


def _grade(sugar: float | None, sodium: float | None, saturated_fat: float | None) -> str | None:
    hierarchy = {"A": 1, "B": 2, "C": 3, "D": 4}
    scores = [
        _score_sugar(sugar),
        _score_sodium(sodium),
        _score_saturated_fat(saturated_fat),
    ]
    known_scores = [score for score in scores if score is not None]
    if not known_scores:
        return None
    return max(known_scores, key=lambda score: hierarchy[score])


def analyze_nutrition_label(image_path: Path) -> dict[str, Any]:
    detected_table = _detect_table(image_path)
    text_parts, ocr_confidence = _read_text(detected_table.crop)
    normalized_text = _normalize_text(text_parts)
    extracted = _extract_nutrition(normalized_text)

    if not any(extracted[key] is not None for key in ("energy", "sugar", "sodium", "saturated_fat")):
        raise NutritionPipelineError(
            "OCR belum berhasil menemukan angka nutrisi utama. Coba gunakan foto yang lebih dekat dan terang."
        )

    serving_size = extracted["serving_size"]
    energy_per_100 = _per_100(extracted["energy"], serving_size)
    sugar_per_100 = _per_100(extracted["sugar"], serving_size)
    sodium_per_100 = _per_100(extracted["sodium"], serving_size)
    saturated_fat_per_100 = _per_100(extracted["saturated_fat"], serving_size)

    basis = "per_100" if serving_size else "per_serving"
    energy_value = energy_per_100 if energy_per_100 is not None else extracted["energy"]
    sugar_value = sugar_per_100 if sugar_per_100 is not None else extracted["sugar"]
    sodium_value = sodium_per_100 if sodium_per_100 is not None else extracted["sodium"]
    saturated_fat_value = (
        saturated_fat_per_100 if saturated_fat_per_100 is not None else extracted["saturated_fat"]
    )

    return {
        "energi": _round_or_none(energy_value),
        "gula": _round_or_none(sugar_value),
        "garam": _round_or_none(sodium_value),
        "lemakJenuh": _round_or_none(saturated_fat_value),
        "takaranSaji": _round_or_none(serving_size),
        "basis": basis,
        "grade": _grade(sugar_value, sodium_value, saturated_fat_value),
        "gulaPer100": _round_or_none(sugar_per_100),
        "garamPer100": _round_or_none(sodium_per_100),
        "energiPer100": _round_or_none(energy_per_100),
        "lemakJenuhPer100": _round_or_none(saturated_fat_per_100),
        "rawValues": {
            "energi": _round_or_none(extracted["energy"]),
            "gula": _round_or_none(extracted["sugar"]),
            "garam": _round_or_none(extracted["sodium"]),
            "lemakJenuh": _round_or_none(extracted["saturated_fat"]),
        },
        "rawText": normalized_text,
        "confidence": {
            "deteksiTabel": _round_or_none(detected_table.confidence, 4),
            "ocr": _round_or_none(ocr_confidence, 4),
        },
    }
