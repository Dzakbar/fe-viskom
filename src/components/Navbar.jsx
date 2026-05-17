import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const handleScroll = (e, id) => {
    // Jika kita sudah berada di halaman Home, cegah jump default dan scroll manual secara smooth
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -100; // menyesuaikan tinggi navbar
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Update URL tanpa melakukan jump
        window.history.pushState(null, '', `/#${id}`);
      }
    }
    // Jika di halaman lain (misal /scan), biarkan sifat bawaan <a> bekerja (pindah ke / lalu scroll oleh Home.jsx)
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-page py-4 max-w-7xl mx-auto">
        <Link to="/" className="font-headline-lg text-headline-lg font-extrabold text-primary">NutriScan</Link>
        <nav className="hidden md:flex gap-8 items-center">
          <a href="/#tentang" onClick={(e) => handleScroll(e, 'tentang')} className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors">Tentang</a>
          <a href="/#fitur" onClick={(e) => handleScroll(e, 'fitur')} className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors">Fitur</a>
          <a href="/#cara-kerja" onClick={(e) => handleScroll(e, 'cara-kerja')} className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors">Cara Kerja</a>
        </nav>
        <div className="flex gap-4 items-center">
          <Link to="/scan" className="bg-primary text-on-primary font-body-lg text-body-lg px-6 py-2.5 rounded-full hover:shadow-md transition-all active:scale-95">Mulai Scan</Link>
        </div>
      </div>
    </header>
  );
}
