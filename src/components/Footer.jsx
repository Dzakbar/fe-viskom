export default function Footer() {
  return (
    <>
      <footer className="w-full py-section-gap px-margin-page flex flex-col items-center gap-stack-md text-center bg-surface-container-lowest border-t border-outline-variant/30 mt-auto hidden md:flex">
        <h2 className="font-headline-md text-headline-md text-primary font-bold">NutriScan</h2>
        <div className="flex gap-stack-lg">
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Syarat & Ketentuan</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Kontak Kami</a>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant opacity-70">© 2024 NutriScan. Pilihan Sehat untuk Hidup Lebih Baik.</p>
      </footer>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/20 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-4 py-3 pb-safe">
        <button className="flex flex-col items-center gap-1 text-on-surface-variant opacity-60 tap-highlight-transparent active:scale-90 transition-transform">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-label-sm">Beranda</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary font-bold scale-110 tap-highlight-transparent active:scale-90 transition-transform">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>center_focus_weak</span>
          <span className="font-label-sm text-label-sm">Pindai</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant opacity-60 tap-highlight-transparent active:scale-90 transition-transform">
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-sm text-label-sm">Riwayat</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant opacity-60 tap-highlight-transparent active:scale-90 transition-transform">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm">Akun</span>
        </button>
      </nav>
    </>
  );
}
