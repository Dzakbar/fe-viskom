# Backend Nutrition Label ML

Backend ini menerima gambar label nutrisi dari frontend, menjalankan YOLO untuk mendeteksi tabel nutrisi, membaca teks dengan EasyOCR, lalu mengirim hasil ekstraksi sebagai JSON.

## Setup

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Server default berjalan di:

```text
http://localhost:8000
```

## Model

Letakkan model YOLO hasil training di:

```text
backend/models/nutrition_table_yolo.pt
```

Atau set environment variable:

```bash
set NUTRITION_YOLO_MODEL=C:\path\ke\best.pt
```

## Endpoint

```http
GET /health
POST /api/scan
```

Field upload untuk `/api/scan`:

```text
image
```
