import { useLocation } from 'react-router-dom';
import { calculateNutriLevel } from '../utils/nutrition';

export default function Result() {
  const location = useLocation();
  // Data dummy, nantinya akan diisi dengan data state dari backend ML
  const nutritionData = location.state?.nutrition || {
    energi: 120, // kkal
    gula: 12, // gram
    garam: 130, // mg
    lemakJenuh: 6 // gram
  };

  const { level, gulaScore, garamScore, lemakScore } = calculateNutriLevel(
    nutritionData.gula, 
    nutritionData.garam, 
    nutritionData.lemakJenuh
  );

  const getLevelColor = (lvl) => {
    switch(lvl) {
      case 'A': return 'bg-[#1e8f4e] text-white'; // Hijau tua
      case 'B': return 'bg-[#85c441] text-white'; // Hijau muda
      case 'C': return 'bg-[#f8b62d] text-white'; // Kuning/Oranye
      case 'D': return 'bg-[#e23c2f] text-white'; // Merah
      default: return 'bg-gray-200';
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
      default: return '';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-margin-page py-section-gap space-y-gutter-grid pb-32 md:pb-16 pt-24">
      <section aria-labelledby="analysis-header" className="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid">
        <h2 className="sr-only" id="analysis-header">Ringkasan Analisis Produk</h2>
        
        {/* Nutri-Level Card */}
        <article className="md:col-span-4 bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_2px_12px_rgba(0,0,0,0.03)] border border-outline-variant/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <header className="w-full mb-4">
            <span className="text-on-surface-variant font-label-bold text-label-bold mb-stack-sm uppercase tracking-widest block">Nutri-Level</span>
          </header>
          
          {/* Badge Visualizer */}
          <div className="flex items-center gap-1 my-4 p-2 border-2 border-gray-200 rounded-3xl bg-white shadow-sm">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl ${level === 'A' ? getLevelColor('A') + ' scale-110 z-10 shadow-md' : 'bg-[#1e8f4e]/20 text-[#1e8f4e]'}`}>A</div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl -ml-2 ${level === 'B' ? getLevelColor('B') + ' scale-110 z-10 shadow-md' : 'bg-[#85c441]/20 text-[#85c441]'}`}>B</div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl -ml-2 ${level === 'C' ? getLevelColor('C') + ' scale-110 z-10 shadow-md' : 'bg-[#f8b62d]/20 text-[#f8b62d]'}`}>C</div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl -ml-2 ${level === 'D' ? getLevelColor('D') + ' scale-110 z-10 shadow-md' : 'bg-[#e23c2f]/20 text-[#e23c2f]'}`}>D</div>
          </div>

          <footer className="mt-4 flex flex-col gap-2">
            <div className={`px-6 py-2 border rounded-full font-bold ${getLevelBorder(level)} bg-opacity-10 text-gray-800`}>
              {getLevelLabel(level)}
            </div>
            {level !== 'A' && (
              <p className="text-xs text-red-500 mt-2 font-bold">Terdeteksi nutrisi dengan kategori D (GGL Tinggi)</p>
            )}
          </footer>
        </article>

        {/* Product Summary Card */}
        <article className="md:col-span-8 bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_2px_12px_rgba(0,0,0,0.03)] border border-outline-variant/20 flex flex-col md:flex-row gap-8 items-center">
          <figure className="w-full md:w-56 aspect-square rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10 shrink-0">
            <img alt="Product Preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8-vfEEGBupCK_1_6qT56tp1CBiTsF1uk8AoiPRXAHf7Injn1dIWT39CqaKVtQQ-8JDy4wQi2-bk2WMQAivqbbhOyFr6KzyHN2eW1SRZO9D1jxw6oGxyc-js4FtYFkn86xcqGl541oD60dTnUIrg1CEKKev07TsfP1_-2_m6G3EccPhfx8_JaCtHF4raF0dQNyFIk-_Pf5dFtDwkmh_-pNhlLe9-87YaMefEWgLkA5p3TYyddDudS3cWjm7Ox6FbRf9W6sKbtydw"/>
          </figure>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <h1 className="font-display text-display text-on-surface">Minuman Terpindai</h1>
              <p className="text-on-surface-variant font-body-lg text-body-lg">Hasil Analisis per 100mL</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
              <span className={`px-4 py-1.5 rounded-full font-label-bold text-label-bold ${getLevelColor(gulaScore)}`}>
                Gula: {nutritionData.gula}g ({gulaScore})
              </span>
              <span className={`px-4 py-1.5 rounded-full font-label-bold text-label-bold ${getLevelColor(garamScore)}`}>
                Garam: {nutritionData.garam}mg ({garamScore})
              </span>
              <span className={`px-4 py-1.5 rounded-full font-label-bold text-label-bold ${getLevelColor(lemakScore)}`}>
                Lemak: {nutritionData.lemakJenuh}g ({lemakScore})
              </span>
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
             {lemakScore === 'B' && (
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary-container shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">Lemak jenuh berada pada batas wajar.</p>
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
