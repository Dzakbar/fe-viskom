import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
  const location = useLocation();

  // Scroll to section based on hash when location changes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Scroll smoothly, adjusting for navbar height (approx 80px)
        const yOffset = -100; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <main className="main-content pt-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero-section max-w-[1280px] mx-auto px-5 py-12">
        <div className="hero-layout grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="hero-content flex flex-col gap-8">
            <div className="hero-badges flex flex-wrap gap-2">
              <span className="badge-item px-4 py-1 bg-primary-container/20 text-on-primary-container text-label-bold font-label-bold rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span> OCR Scanner
              </span>
              <span className="badge-item px-4 py-1 bg-tertiary-container/20 text-on-tertiary-container text-label-bold font-label-bold rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">health_metrics</span> Nutrition Checker
              </span>
              <span className="badge-item px-4 py-1 bg-secondary-container/20 text-on-secondary-container text-label-bold font-label-bold rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">spa</span> Healthy Lifestyle
              </span>
            </div>
            <div className="hero-text flex flex-col gap-4">
              <h1 className="font-display text-display text-on-surface leading-tight text-5xl md:text-6xl max-w-lg">
                Cek Kesehatan Minuman Kemasan Secara <span className="text-primary">Praktis</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Gunakan kamera ponsel Anda untuk memindai label nilai gizi. Pahami apa yang Anda minum dan pilihlah minuman yang lebih sehat untuk tubuh Anda setiap hari.
              </p>
            </div>
            <div className="hero-cta flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/scan" className="btn-primary-lg px-8 py-4 bg-primary text-on-primary font-headline-md text-headline-md rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                Mulai Scan Sekarang
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <a href="#tentang" className="btn-outline-lg px-8 py-4 border-2 border-outline text-on-surface font-headline-md text-headline-md rounded-2xl hover:bg-surface-container-low transition-all text-center">
                Pelajari Selengkapnya
              </a>
            </div>
          </div>
          <div className="hero-visual relative flex items-center justify-center">
            {/* Background Decorative Blob */}
            <div className="bg-blob absolute -z-10 w-[120%] h-[120%] bg-gradient-to-br from-[#F1F8F1] to-[#E7EEFE] rounded-full blur-3xl opacity-60"></div>
            <div className="mockup-container relative z-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-2xl overflow-hidden flex flex-col gap-4">
              <img alt="NutriScan Dashboard Interface" className="rounded-xl shadow-md w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNkLYI94_vFH2bOvcOOnGat8XNnQ7s6phPgcYWQrM4zYT8DgdMzVBOed3Blk4Xh-uXQ4QR8OZQas8MYL3fkV1kh_lMcvH-2p8gQFA-hbgdEKAygqaHUjeRGOblFvbLyl23FWnmEknMWexCHipzRd43rU1XGC8FE4uWdBEsgHd9FJpaXJnRkS3Wyi5DeQOUgu0ABkzNmFilN25lshvvnii8-_DNcuLPxKQvwoMKwaXVqogaKC1GfrJhonWe2O8O5tJVv9l8maHwDg" />
              {/* Floating Data Card */}
              <div className="floating-score-card absolute top-6 right-6 bg-white p-4 rounded-xl shadow-lg animate-bounce flex items-center gap-4 border border-outline-variant/20">
                <div className="score-circle w-12 h-12 rounded-full border-4 border-primary border-t-transparent flex items-center justify-center font-bold text-primary">82</div>
                <div className="score-info flex flex-col">
                  <p className="text-label-bold font-label-bold">Health Score</p>
                  <p className="text-label-sm text-primary">Kategori: Baik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG Section Component */}
      <section id="tentang" className="about-section bg-surface-container-low/50 py-16 scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-5 flex flex-col gap-6 text-center">
          <h2 className="font-display text-display text-on-surface">Apa Itu NutriScan?</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            NutriScan adalah asisten kesehatan cerdas di genggaman Anda. Kami hadir untuk membantu Anda membuat keputusan yang lebih sehat setiap kali berbelanja minuman kemasan. Cukup dengan menjepret label komposisi atau tabel nilai gizi pada kemasan, sistem pintar kami akan menerjemahkannya menjadi wawasan kesehatan yang mudah dipahami berdasarkan tingkat Gula, Garam, dan Lemak (GGL).
          </p>
        </div>
      </section>

      {/* FITUR Section Component */}
      <section id="fitur" className="features-section py-20 scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-5 flex flex-col gap-12">
          <header className="section-header text-center flex flex-col gap-4">
            <h2 className="font-display text-display text-on-surface">Fitur Unggulan</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Solusi lengkap untuk asupan gizi yang terkontrol.</p>
          </header>
          <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="feature-card bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-2 transition-all group flex flex-col gap-6 border border-outline-variant/30">
              <div className="icon-box w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
              </div>
              <div className="card-content flex flex-col gap-2">
                <h3 className="font-headline-lg text-headline-lg">Scan Label Gizi</h3>
                <p className="text-on-surface-variant font-body-md text-body-md">Teknologi OCR canggih membaca tabel gizi dari foto kemasan produk secara instan dan akurat tanpa perlu diketik manual.</p>
              </div>
            </article>
            <article className="feature-card bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-2 transition-all group flex flex-col gap-6 border border-outline-variant/30">
              <div className="icon-box w-16 h-16 bg-tertiary-container/10 rounded-2xl flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[32px]">query_stats</span>
              </div>
              <div className="card-content flex flex-col gap-2">
                <h3 className="font-headline-lg text-headline-lg">Analisis Kesehatan</h3>
                <p className="text-on-surface-variant font-body-md text-body-md">Data gizi secara langsung dianalisis dan diklasifikasikan menjadi Nutri-Level (A, B, C, D) yang jelas dan transparan.</p>
              </div>
            </article>
            <article className="feature-card bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-2 transition-all group flex flex-col gap-6 border border-outline-variant/30">
              <div className="icon-box w-16 h-16 bg-secondary-container/10 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[32px]">favorite</span>
              </div>
              <div className="card-content flex flex-col gap-2">
                <h3 className="font-headline-lg text-headline-lg">Saran Nutrisi</h3>
                <p className="text-on-surface-variant font-body-md text-body-md">Dapatkan tips gaya hidup cerdas dan saran konsumsi harian berdasarkan hasil analisis untuk tubuh yang lebih bugar.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CARA KERJA Section Component */}
      <section id="cara-kerja" className="how-it-works bg-surface-container-high/30 py-20 scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-5 flex flex-col gap-12">
          <h2 className="font-display text-display text-on-surface text-center">Bagaimana Cara Kerjanya?</h2>
          <div className="steps-grid grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="step-item flex flex-col items-center text-center gap-6 relative">
              <div className="step-number w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-2xl z-10 shadow-lg">1</div>
              <div className="step-info flex flex-col gap-2">
                <h4 className="font-label-bold text-label-bold uppercase tracking-wider text-primary">Scan / Upload</h4>
                <p className="text-on-surface-variant text-body-md">Arahkan kamera ponsel Anda ke label gizi produk atau unggah foto dari galeri.</p>
              </div>
            </div>
            <div className="step-item flex flex-col items-center text-center gap-6 relative">
              <div className="step-number w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-2xl z-10 shadow-lg">2</div>
              <div className="step-info flex flex-col gap-2">
                <h4 className="font-label-bold text-label-bold uppercase tracking-wider text-primary">Read Info</h4>
                <p className="text-on-surface-variant text-body-md">Sistem kami menggunakan kecerdasan buatan untuk mengekstrak angka gizi penting (GGL).</p>
              </div>
            </div>
            <div className="step-item flex flex-col items-center text-center gap-6 relative">
              <div className="step-number w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-2xl z-10 shadow-lg">3</div>
              <div className="step-info flex flex-col gap-2">
                <h4 className="font-label-bold text-label-bold uppercase tracking-wider text-primary">Analyze</h4>
                <p className="text-on-surface-variant text-body-md">Algoritma mengevaluasi nutrisi tersebut sesuai ambang batas medis yang disarankan.</p>
              </div>
            </div>
            <div className="step-item flex flex-col items-center text-center gap-6">
              <div className="step-number w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-2xl z-10 shadow-lg">4</div>
              <div className="step-info flex flex-col gap-2">
                <h4 className="font-label-bold text-label-bold uppercase tracking-wider text-primary">Display Result</h4>
                <p className="text-on-surface-variant text-body-md">Nutri-Level, peringatan, dan rekomendasi konsumsi akan langsung tampil di layar Anda.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Component */}
      <section className="cta-section max-w-[1280px] mx-auto px-5 py-24">
        <div className="cta-box bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden flex flex-col gap-8 items-center">
          <div className="cta-content relative z-10 flex flex-col gap-6">
            <h2 className="font-display text-display text-on-primary text-4xl md:text-5xl">Mulai Gaya Hidup Sehat <br/>Sekarang Juga</h2>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl mx-auto">
              Ribuan orang telah memilih NutriScan untuk menjaga asupan gizi mereka. Jangan biarkan minuman berpemanis merusak kesehatan jangka panjang Anda.
            </p>
          </div>
          <Link to="/scan" className="btn-primary-white px-12 py-4 bg-white text-primary font-headline-md text-headline-md rounded-2xl hover:bg-surface-container-high transition-all shadow-xl hover:scale-105 active:scale-95 relative z-10">
            Mulai Scan Sekarang
          </Link>
        </div>
      </section>
    </main>
  );
}
