interface FooterProps {
  currentLang: 'uz' | 'en';
}

export default function Footer({ currentLang }: FooterProps) {
  const t = currentLang === 'uz' ? {
    status: "Available for Worldwide Projects",
    desc: "Raqamli mahsulotlar va yuqori darajadagi 3D WebGL tajribalarini loyihalash hamda muhandislik amaliyoti.",
    copyright: "© 2025 AURA.DEV // NEXUS.3D. Barcha huquqlar himoyalangan.",
    location: "Toshkent / Global Remote",
    techList: "GLSL • Three.js • WebGPU",
  } : {
    status: "Available for Worldwide Projects",
    desc: "High-end 3D WebGL digital product design and creative engineering practice.",
    copyright: "© 2025 AURA.DEV // NEXUS.3D. All rights reserved.",
    location: "Tashkent / Global Remote",
    techList: "GLSL • Three.js • WebGPU",
  };

  const socials = [
    { name: 'GitHub', icon: 'terminal', url: 'https://github.com' },
    { name: 'LinkedIn', icon: 'work', url: 'https://linkedin.com' },
    { name: 'Telegram', icon: 'send', url: 'https://t.me' },
    { name: 'Dribbble', icon: 'palette', url: 'https://dribbble.com' },
  ];

  return (
    <footer className="w-full bg-[#0c0e13]/95 backdrop-blur-2xl py-14 border-t border-white/5 relative z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Studio info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#38bdf8]" />
              </div>
              <span className="font-['JetBrains_Mono'] text-xs uppercase text-[#8ed5ff] tracking-widest">
                {t.status}
              </span>
            </div>
            <p className="font-['Geist'] text-sm text-[#bdc8d1] max-w-md">
              {t.desc}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3 font-['JetBrains_Mono'] text-xs">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-[#191c21] hover:bg-[#282a30] text-[#bdc8d1] hover:text-[#e2e2ea] border border-white/5 hover:border-white/15 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">{s.icon}</span>
                <span>{s.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-[#bdc8d1] font-['JetBrains_Mono'] text-xs">
          <div>{t.copyright}</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#38bdf8] text-[14px]">bolt</span>
              <span>{t.location}</span>
            </span>
            <span className="text-[#3e484f]">•</span>
            <span>{t.techList}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
