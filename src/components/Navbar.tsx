import { useState, useEffect } from 'react';
import { soundSystem } from '../utils/audio';

interface NavbarProps {
  currentLang: 'uz' | 'en';
  onToggleLang: () => void;
  onOpenConsultation: () => void;
}

export default function Navbar({ currentLang, onToggleLang, onOpenConsultation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    const active = soundSystem.toggle();
    setAudioActive(active);
    soundSystem.playBlip();
  };

  const navLinks = currentLang === 'uz' ? [
    { name: 'Loyiha & Ishlar', href: '#tanlangan-loyihalar' },
    { name: "Xizmatlar & Ko'nikmalar", href: '#ekspertiza' },
    { name: 'Arxitektura', href: '#pipeline' },
    { name: 'Mijozlar fikri', href: '#fikrlar' },
    { name: "Bog'lanish", href: '#kontakt' },
  ] : [
    { name: 'Projects & Works', href: '#tanlangan-loyihalar' },
    { name: 'Services & Skills', href: '#ekspertiza' },
    { name: 'Architecture', href: '#pipeline' },
    { name: 'Reviews', href: '#fikrlar' },
    { name: 'Contact', href: '#kontakt' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-[#111319]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3' : 'py-5'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer focus-visible:outline-none"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-3 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8] group-hover:scale-125 transition-transform" />
            <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-[#e2e2ea] flex items-center">
              KHUSANOV<span className="text-[#8ed5ff]">.DEV</span>
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium px-2 py-0.5 rounded bg-[#282a30] text-[#bdc8d1] tracking-wide border border-white/5">
              v3.0
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-[#191c21]/80 backdrop-blur-2xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 rounded-full font-['JetBrains_Mono'] text-sm text-[#bdc8d1] hover:text-[#e2e2ea] hover:bg-[#282a30]/60 transition-colors whitespace-nowrap"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Sound Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              audioActive
                ? 'bg-[#38bdf8]/20 text-[#38bdf8] shadow-[0_0_16px_rgba(56,189,248,0.4)] border border-[#38bdf8]/40'
                : 'bg-[#191c21]/90 backdrop-blur-xl text-[#bdc8d1] hover:text-[#8ed5ff] border border-white/5'
            }`}
            title={audioActive ? "Ovozni o'chirish" : "Cyber Ambient Ovozni yoqish"}
            type="button"
            aria-label="Toggle ambient audio"
          >
            <span className="material-symbols-outlined text-[20px]">
              {audioActive ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center px-3 py-1.5 rounded-full bg-[#191c21]/90 backdrop-blur-xl font-['JetBrains_Mono'] text-xs text-[#bdc8d1] border border-white/5 hover:border-white/15 transition-all"
            type="button"
            title="Tilni o'zgartirish / Change Language"
          >
            <span className={currentLang === 'uz' ? 'text-[#38bdf8] font-bold' : 'opacity-60'}>UZ</span>
            <span className="mx-1 opacity-30">/</span>
            <span className={currentLang === 'en' ? 'text-[#38bdf8] font-bold' : 'opacity-60'}>EN</span>
          </button>

          {/* CTA Button */}
          <button
            onClick={onOpenConsultation}
            className="hidden md:inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#38bdf8] text-[#00354a] font-['Space_Grotesk'] text-sm font-semibold shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:shadow-[0_0_32px_rgba(56,189,248,0.6)] hover:bg-[#7bd0ff] transition-all whitespace-nowrap cursor-pointer"
            type="button"
          >
            {currentLang === 'uz' ? 'Loyihani boshlash' : 'Start a Project'}
          </button>

          {/* Profile / Engineer status trigger */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#a855f7] p-[1.5px] cursor-pointer focus-visible:outline-none transition-transform hover:scale-105"
              title="Muhandis profili"
              type="button"
            >
              <div className="w-full h-full rounded-full bg-[#111319] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">person</span>
              </div>
            </button>

            {/* Profile Dropdown Card */}
            {showProfile && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#191c21] border border-white/10 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#a855f7] flex items-center justify-center font-bold text-black font-['Space_Grotesk'] text-lg">
                    KD
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-[#e2e2ea] text-sm">KHUSANOV.DEV Studio</h4>
                    <p className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff]">Creative Technologist</p>
                  </div>
                </div>
                <div className="py-3 flex flex-col gap-2 font-['Geist'] text-xs text-[#bdc8d1]">
                  <div className="flex items-center justify-between">
                    <span>Holat:</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Yangi buyurtmalarga ochiq
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Joylashuv:</span>
                    <span className="text-[#e2e2ea]">Toshkent (UTC+5)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tajriba:</span>
                    <span className="text-[#e2e2ea]">6+ yil (WebGL / 3D)</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex gap-2">
                  <a
                    href="https://t.me/Khusanov_off"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 rounded-lg bg-[#282a30] hover:bg-[#33353b] text-center font-['JetBrains_Mono'] text-xs text-[#e2e2ea] transition-colors"
                  >
                    Telegram
                  </a>
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      onOpenConsultation();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-[#38bdf8] text-[#00354a] font-semibold text-center font-['Space_Grotesk'] text-xs transition-colors"
                  >
                    Muloqot
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg bg-[#191c21] flex items-center justify-center text-[#e2e2ea] border border-white/5"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#111319]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-['Space_Grotesk'] font-medium text-[#bdc8d1] hover:text-[#38bdf8] border-b border-white/5"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenConsultation();
            }}
            className="mt-2 w-full py-3 rounded-lg bg-[#38bdf8] text-[#00354a] font-['Space_Grotesk'] font-semibold text-center"
          >
            {currentLang === 'uz' ? 'Loyihani boshlash' : 'Start a Project'}
          </button>
        </div>
      )}
    </header>
  );
}
