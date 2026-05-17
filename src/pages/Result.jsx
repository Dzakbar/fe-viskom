import { Link, useLocation } from 'react-router-dom';
import { calculateNutriLevel } from '../utils/nutrition';

const formatNumber = (value, unit = '') => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Belum terbaca';
  return `${number.toLocaleString('id-ID', { maximumFractionDigits: 2 })}${unit}`;
};

const getLevelColor = (lvl) => {
  switch(lvl) {
    case 'A': return 'bg-[#1e8f4e] text-white'; // Hijau tua
    case 'B': return 'bg-[#85c441] text-white'; // Hijau muda
    case 'C': return 'bg-[#f8b62d] text-white'; // Kuning/Oranye
    case 'D': return 'bg-[#e23c2f] text-white'; // Merah
    default: return 'bg-gray-200 text-gray-700';
  }
};

const getLevelSoftColor = (lvl) => {
  switch(lvl) {
    case 'A': return 'bg-[#1e8f4e]/20 text-[#1e8f4e]';
    case 'B': return 'bg-[#85c441]/20 text-[#5d8f2d]';
    case 'C': return 'bg-[#f8b62d]/20 text-[#a66f12]';
    case 'D': return 'bg-[#e23c2f]/20 text-[#b7281f]';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const getLevelBorder = (lvl) => {
  switch(lvl) {
    case 'A': return 'border-[#1e8f4e]';
    case 'B': return 'border-[#85c441]';
    case 'C': return 'border-[#f8b62d]';
    case 'D': return 'border-[#e23c2f]';
    default: return 'border-gray-200';
  }
};

const getLevelLabel = (lvl) => {
  switch(lvl) {
    case 'A': return 'GGL Paling Rendah';
    case 'B': return 'GGL Rendah';
    case 'C': return 'GGL Sedang';
    case 'D': return 'GGL Paling Tinggi';
    default: return 'Data Belum Lengkap';
  }
};

const ScoreBadge = ({ label, value, unit, score }) => (
  <span className={`px-4 py-1.5 rounded-full font-label-bold text-label-bold ${score ? getLevelColor(score) : 'bg-gray-100 text-gray-600'}`}>
    {label}: {formatNumber(value, unit)} {score ? `(${score})` : ''}
  </span>
);

export default function Result() {
  const location = useLocation();
  const nutritionData = location.state?.nutrition;
  const imagePreview = location.state?.imagePreview;
  const fileName = location.state?.fileName;

  if (!nutritionData) {
    return (
      <main className="max-w-3xl mx-auto px-margin-page py-section-gap pt-24 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px]">document_scanner</span>
        </div>
        <div>
          <h1 className="font-display text-display text-on-surface mb-2">Belum Ada Hasil Scan</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Upload label nutrisi dari halaman scan untuk melihat hasil analisis.
          </p>
        </div>
        <Link
          to="/scan"
          className="bg-primary text-on-primary font-label-bold text-label-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Mulai Scan
        </Link>
      </main>
    );
  }

  const { level, gulaScore, garamScore, lemakScore } = calculateNutriLevel(
    nutritionData.gula, 
    nutritionData.garam, 
    nutritionData.lemakJenuh
  );

  const getBasisLabel = () => {
    if (nutritionData.basis === 'per_100') return 'Hasil Analisis per 100g/ml';
    return 'Hasil Analisis sesuai takaran saji';
  };

  const hasAnyInsight = gulaScore || garamScore || lemakScore;
  const isHighRisk = level === 'C' || level === 'D';

  return (
    <main className="max-w-7xl mx-auto px-margin-page py-section-gap space-y-gutter-grid pb-32 md:pb-16 pt-24">
      <section aria-labelledby="analysis-header" className="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid">
        <h2 className="sr-only" id="analysis-header">Ringkasan Analisis Produk</h2>
        
        {/* Nutri-Level Card */}
        <article className="md:col-span-4 bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_2px_12px_rgba(0,0,0,0.03)] border border-outline-variant/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <header className="w-full mb-4">
            <span className="text-on-surface-variant font-label-bold text-label-bold mb-stack-sm uppercase block">Nutri-Level</span>
          </header>
          
          {/* Badge Visualizer */}
          <div className="flex items-center gap-1 my-4 p-2 border-2 border-gray-200 rounded-3xl bg-white shadow-sm">
            {['A', 'B', 'C', 'D'].map((grade) => (
              <div
                key={grade}
                className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl ${grade !== 'A' ? '-ml-2' : ''} ${level === grade ? `${getLevelColor(grade)} scale-110 z-10 shadow-md` : getLevelSoftColor(grade)}`}
              >
                {grade}
              </div>
            ))}
          </div>

          <footer className="mt-4 flex flex-col gap-2">
            <div className={`px-6 py-2 border rounded-full font-bold ${getLevelBorder(level)} bg-opacity-10 text-gray-800`}>
              {getLevelLabel(level)}
            </div>
            {isHighRisk && (
              <p className="text-xs text-red-500 mt-2 font-bold">Terdeteksi nutrisi dengan kategori GGL perlu dibatasi</p>
            )}
          </footer>
        </article>

        {/* Product Summary Card */}
        <article className="md:col-span-8 bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_2px_12px_rgba(0,0,0,0.03)] border border-outline-variant/20 flex flex-col md:flex-row gap-8 items-center">
          <figure className="w-full md:w-56 aspect-square rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10 shrink-0">
            {imagePreview ? (
              <img alt="Preview label nutrisi" className="w-full h-full object-cover" src={imagePreview} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[48px]">image_search</span>
              </div>
            )}
          </figure>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <h1 className="font-display text-display text-on-surface">Minuman Terpindai</h1>
              <p className="text-on-surface-variant font-body-lg text-body-lg">{getBasisLabel()}</p>
              {fileName && (
                <p className="text-on-surface-variant font-label-sm text-label-sm break-all">{fileName}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
              <ScoreBadge label="Gula" value={nutritionData.gula} unit="g" score={gulaScore} />
              <ScoreBadge label="Natrium" value={nutritionData.garam} unit="mg" score={garamScore} />
              <ScoreBadge label="Lemak jenuh" value={nutritionData.lemakJenuh} unit="g" score={lemakScore} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="rounded-lg bg-surface-container-low/50 p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant">Energi</p>
                <p className="font-headline-md text-headline-md text-on-surface">{formatNumber(nutritionData.energi, ' kkal')}</p>
              </div>
              <div className="rounded-lg bg-surface-container-low/50 p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant">Takaran</p>
                <p className="font-headline-md text-headline-md text-on-surface">{formatNumber(nutritionData.takaranSaji, ' ml/g')}</p>
              </div>
              <div className="rounded-lg bg-surface-container-low/50 p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant">Deteksi</p>
                <p className="font-headline-md text-headline-md text-on-surface">{formatNumber((nutritionData.confidence?.deteksiTabel || 0) * 100, '%')}</p>
              </div>
              <div className="rounded-lg bg-surface-container-low/50 p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant">OCR</p>
                <p className="font-headline-md text-headline-md text-on-surface">{formatNumber((nutritionData.confidence?.ocr || 0) * 100, '%')}</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Section: Insights & Recommendations */}
      <section aria-labelledby="insights-title" className="grid grid-cols-1 md:grid-cols-2 gap-gutter-grid">
        <h2 className="sr-only" id="insights-title">Wawasan dan Saran</h2>
        <article className="bg-white p-stack-lg rounded-xl border border-outline-variant/30 shadow-sm flex flex-col">
          <header className="mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary p-1.5 bg-primary/5 rounded-lg">insights</span>
              Mengapa Skor Ini?
            </h3>
          </header>
          <ul className="space-y-4 flex-1">
            {!hasAnyInsight && (
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">info</span>
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">Data nutrisi utama belum lengkap, jadi skor perlu dicek manual.</p>
              </li>
            )}
            {gulaScore === 'D' && (
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-error shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">Kandungan gula sangat tinggi (&gt;10g per 100mL). Sebaiknya hindari konsumsi berlebih.</p>
              </li>
            )}
             {garamScore === 'C' && (
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-orange-500 shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">Kandungan garam cukup tinggi. Perhatikan batasan asupan harian.</p>
              </li>
            )}
            {garamScore === 'D' && (
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-error shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">Kandungan natrium sangat tinggi. Batasi konsumsi produk ini.</p>
              </li>
            )}
             {lemakScore === 'B' && (
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary-container shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">Lemak jenuh berada pada batas wajar.</p>
              </li>
            )}
            {!lemakScore && (
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">visibility_off</span>
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">Lemak jenuh belum terbaca dari OCR, jadi skor akhir memakai data yang tersedia.</p>
              </li>
            )}
          </ul>
        </article>
        
        <article className="bg-primary/5 p-stack-lg rounded-xl border border-primary/20 shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex-1">
            <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined">restaurant</span>
              Saran Konsumsi
            </h3>
            <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed mb-8">
              {level === 'A' || level === 'B' 
                ? 'Produk ini aman dikonsumsi dan sangat cocok untuk menjaga energi tanpa khawatir kelebihan GGL.'
                : 'Produk ini sebaiknya dibatasi konsumsinya. Pertimbangkan mencari alternatif dengan Nutri-Level A atau B yang lebih aman untuk tubuh.'}
            </p>
            {nutritionData.rawText && (
              <details className="rounded-lg bg-white/70 border border-primary/10 p-4 text-left">
                <summary className="cursor-pointer font-label-bold text-label-bold text-primary">Teks OCR</summary>
                <p className="mt-3 text-body-md font-body-md text-on-surface-variant leading-relaxed break-words">
                  {nutritionData.rawText}
                </p>
              </details>
            )}
          </div>
          <button className="relative z-10 w-full bg-primary text-on-primary font-label-bold text-label-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group mt-4">
            <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span> 
            Simpan ke Riwayat
          </button>
        </article>
      </section>
    </main>
  );
}
