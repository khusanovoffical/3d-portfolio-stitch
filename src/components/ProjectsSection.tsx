import { useState } from 'react';

interface ProjectsSectionProps {
  currentLang: 'uz' | 'en';
  onOpenCarConfig: () => void;
  onOpenCyberDemo: () => void;
  onOpenFintechDemo: () => void;
  onOpenTechDocs: (projectName: string) => void;
}

export default function ProjectsSection({
  currentLang,
  onOpenCarConfig,
  onOpenCyberDemo,
  onOpenFintechDemo,
  onOpenTechDocs,
}: ProjectsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'webgl' | 'fintech'>('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const t = currentLang === 'uz' ? {
    kicker: "// TANLANGAN ISHLAR (2024 - 2025)",
    title: "E'tiborga Molik 3D & Web Loyihalar",
    filterAll: "Barchasi",
    filter3D: "WebGL / 3D",
    filterFintech: "SaaS & Fintech",
    launchExp: "Tajribani ishga tushirish",
    techDocs: "Texnik hujjatlar →",
    viewDemo: "Demo ko'rish",
    openConfig: "Konfiguratorni ochish",
    latency: "Latency: <14ms",
  } : {
    kicker: "// SELECTED WORKS (2024 - 2025)",
    title: "Featured 3D & Web Projects",
    filterAll: "All Projects",
    filter3D: "WebGL / 3D",
    filterFintech: "SaaS & Fintech",
    launchExp: "Launch Experience",
    techDocs: "Technical Docs →",
    viewDemo: "View Live Demo",
    openConfig: "Open Configurator",
    latency: "Latency: <14ms",
  };

  const projects = [
    {
      id: 'cyberpunk',
      category: 'webgl',
      caseNumber: 'CASE STUDY // 01',
      caseSubtitle: 'METAVERSE COMMERCE',
      badgeClass: 'text-[#ddb7ff]',
      title: 'CYBERPUNK METAVERSE 2025',
      desc: currentLang === 'uz'
        ? "Kompaniya uchun to'liq 3D virtual showroom va 360 darajali kiber-muhit yaratildi. Foydalanuvchilar real vaqtda mahsulotlarni spatial audio va WebGL GLSL shaderlar hamrohligida ko'zdan kechirishadi."
        : "Complete 3D virtual showroom and 360-degree cybernetic space. Visitors inspect products with real-time spatial audio and custom GLSL vertex/fragment shaders.",
      tags: ['Three.js', 'GLSL Shaders', 'React Three Fiber', 'WebAudio'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL7UXBNGjv-_ZCoLyHNnQztmA1YdYiP9MhhWPg0rMR_UueXNaICT238mpO_7fx0ypkkIcnfCwHt2pc5keFmXx_AJQCQOj8pYgLYqJEq8tg_MZJhpHBP_LQYkvetutKNEAeNrwugCS_hd1dVum37e-sVeW4JJ5ViYUHxSeX9gJxIXMl3mOvwZCN34XcxbHzFh-SDPriH8ABAKruGeH-tjqjr9p6IBSO34781KEyhb7qDf9lgbw9yNCsKw',
      hudTopLeft: 'LIVE WEBGL DEMO',
      hudBottomRight: 'AWWWARDS SOTD',
      icon: 'view_in_ar',
      onPrimaryClick: onOpenCyberDemo,
      onDocsClick: () => onOpenTechDocs('CYBERPUNK METAVERSE 2025'),
    },
    {
      id: 'fintech',
      category: 'fintech',
      caseNumber: 'CASE STUDY // 02',
      caseSubtitle: 'ALGORITHMIC FINANCE',
      badgeClass: 'text-[#c5c9ff]',
      title: 'NEURAL FINTECH DASHBOARD',
      desc: currentLang === 'uz'
        ? "Katta hajmdagi moliyaviy ma'lumotlar va bozor tebranishlarini 3D fazoviy klasterlar hamda oqimlar ko'rinishida real vaqt rejimida vizualizatsiya qiluvchi institutsional tahlil platformasi."
        : "Institutional market telemetry platform projecting large-scale order flow and depth books into 3D spatial clusters with sub-14ms WebSocket pipelines.",
      tags: ['WebGL Points', 'D3.js Topology', 'TypeScript', 'WebSockets'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi_4eZoqyz4vumf9g2L4vrJ0CKlC-QdyJ7V4ZFPRUyo8ywznT5tVV8QovIQWMY01T87uGVJbHyUHp46wBiSP0lc2FYvtc3DwjtQT3lMLPxgLS4uxRWGr3CFHpXBE4isuYeEST_Et_Wtw-JKCoeU2IPiGhpQvoE2rTObSB2mzY475Enzo_JUaP1uO_kmJhnUFEPXW-q9YD_obtx3PvzP7MF2BeuSeXuy7uNjXeVy6xJtJjlGm981YcwA',
      hudTopRight: '100K+ CONCURRENT NODES',
      icon: 'terminal',
      onPrimaryClick: onOpenFintechDemo,
      onDocsClick: () => onOpenTechDocs('NEURAL FINTECH DASHBOARD'),
    },
    {
      id: 'automotive',
      category: 'webgl',
      caseNumber: 'CASE STUDY // 03',
      caseSubtitle: 'AUTOMOTIVE 3D CONFIG',
      badgeClass: 'text-[#8ed5ff]',
      title: 'AURA LUXURY CAR CONFIGURATOR',
      desc: currentLang === 'uz'
        ? "Mijozlar uchun real vaqtda avtomobil tashqi rangi, diskasi, uglerod tolalari va charm salonini to'liq moslashtirish imkonini beruvchi fotorealistik WebGL konfigurator tizimi."
        : "Photorealistic WebGL vehicle configurator allowing clients to customize exterior paint, carbon fiber aero packages, custom forged wheels, and bespoke interiors in real time.",
      tags: ['Three.js PBR', 'HDR Lighting', 'Post-Processing Bloom', 'GLTF Draco'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZR5IUL9OG_lfLL2G60D_y3x3zwfKDZOdIGIGRRZx-J7wx5CH9S9LRtHynPZZRbIZY_s9VhCgUl2TQVVlX05bexY_ujmP69udyNRAxWn2OtK64KxcQAhkl6vMiYjpZ31MUsVMVQF4IVmnqqabqx074IusN6RDYNCK21jWXa4JMW_iOzKHukDdJfEZq3v6DN6kKysTBcKbPoBV_LLiH1uHM6FsA7-OzCls4lI7Py2rz0rnqTmpSAmwXxQ',
      hudBottomLeft: 'PBR REAL-TIME RAYTRACING',
      icon: 'directions_car',
      onPrimaryClick: onOpenCarConfig,
      onDocsClick: () => onOpenTechDocs('AURA LUXURY CAR CONFIGURATOR'),
    },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <section className="w-full py-20 bg-[#0c0e13] relative z-10" id="tanlangan-loyihalar">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Title & Filter Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase tracking-widest mb-1.5">
              {t.kicker}
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e2e2ea]">
              {t.title}
            </h2>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-xs bg-[#191c21] p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold shadow-sm'
                  : 'text-[#bdc8d1] hover:text-[#e2e2ea]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilter('webgl')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'webgl'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold shadow-sm'
                  : 'text-[#bdc8d1] hover:text-[#e2e2ea]'
              }`}
            >
              {t.filter3D}
            </button>
            <button
              onClick={() => setFilter('fintech')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'fintech'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold shadow-sm'
                  : 'text-[#bdc8d1] hover:text-[#e2e2ea]'
              }`}
            >
              {t.filterFintech}
            </button>
          </div>
        </div>

        {/* Projects Stack */}
        <div className="flex flex-col gap-10">
          {filteredProjects.map((p, idx) => {
            const isFintech = p.id === 'fintech';

            return (
              <div
                key={p.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#191c21] border border-white/5 shadow-2xl transition-all duration-300 hover:border-white/15"
              >
                {/* Media Column */}
                <div
                  className={`lg:col-span-7 relative group overflow-hidden rounded-xl bg-[#0c0e13] border border-white/5 ${
                    isFintech ? 'order-1 lg:order-2' : ''
                  }`}
                >
                  {imageErrors[p.id] ? (
                    <div className="w-full h-[320px] sm:h-[400px] bg-gradient-to-br from-[#111319] via-[#1d2025] to-[#111319] flex flex-col items-center justify-center p-6 text-center">
                      <span className="material-symbols-outlined text-[48px] text-[#38bdf8] mb-2">{p.icon}</span>
                      <h4 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2ea]">{p.title}</h4>
                      <p className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1] mt-1">3D WebGL Spatial Experience</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(p.id)}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Overlaid HUD Tags */}
                  {p.hudTopLeft && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0c0e13]/85 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#38bdf8] border border-white/10">
                      <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
                      <span>{p.hudTopLeft}</span>
                    </div>
                  )}

                  {p.hudTopRight && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0c0e13]/85 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#c5c9ff] border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-[#c5c9ff] animate-pulse" />
                      <span>{p.hudTopRight}</span>
                    </div>
                  )}

                  {p.hudBottomLeft && (
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0c0e13]/85 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#ddb7ff] border border-white/10">
                      <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                      <span>{p.hudBottomLeft}</span>
                    </div>
                  )}

                  {p.hudBottomRight && (
                    <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#282a30]/90 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#e2e2ea] border border-white/10">
                      <span>{p.hudBottomRight}</span>
                      <span className="material-symbols-outlined text-[#38bdf8] text-[16px]">verified</span>
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div className={`lg:col-span-5 flex flex-col gap-4 ${isFintech ? 'order-2 lg:order-1' : ''}`}>
                  <div className={`flex items-center gap-2 font-['JetBrains_Mono'] text-xs ${p.badgeClass}`}>
                    <span>{p.caseNumber}</span>
                    <span>•</span>
                    <span>{p.caseSubtitle}</span>
                  </div>

                  <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#e2e2ea] tracking-tight">
                    {p.title}
                  </h3>

                  <p className="font-['Geist'] text-sm sm:text-base text-[#bdc8d1] leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded bg-[#282a30] font-['JetBrains_Mono'] text-xs text-[#8ed5ff] border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    {p.id === 'cyberpunk' && (
                      <button
                        onClick={p.onPrimaryClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#38bdf8] text-[#00354a] font-['Space_Grotesk'] text-sm font-semibold shadow-md hover:bg-[#7bd0ff] transition-all cursor-pointer"
                      >
                        <span>{t.launchExp}</span>
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </button>
                    )}

                    {p.id === 'fintech' && (
                      <button
                        onClick={p.onPrimaryClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#282a30] hover:bg-[#33353b] text-[#e2e2ea] font-['Space_Grotesk'] text-sm font-semibold transition-colors cursor-pointer border border-white/10"
                      >
                        <span>{t.viewDemo}</span>
                        <span className="material-symbols-outlined text-[18px]">terminal</span>
                      </button>
                    )}

                    {p.id === 'automotive' && (
                      <button
                        onClick={p.onPrimaryClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#282a30] hover:bg-[#33353b] text-[#e2e2ea] font-['Space_Grotesk'] text-sm font-semibold transition-colors cursor-pointer border border-white/10"
                      >
                        <span>{t.openConfig}</span>
                        <span className="material-symbols-outlined text-[18px]">directions_car</span>
                      </button>
                    )}

                    {isFintech && (
                      <span className="font-['JetBrains_Mono'] text-xs text-[#87929a]">{t.latency}</span>
                    )}

                    <button
                      onClick={p.onDocsClick}
                      className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1] hover:text-[#38bdf8] transition-colors cursor-pointer"
                    >
                      {t.techDocs}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
