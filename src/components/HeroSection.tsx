import { useState } from 'react';
import Hero3DCanvas from './Hero3DCanvas';

interface HeroSectionProps {
  currentLang: 'uz' | 'en';
  onOpenConsultation: () => void;
}

export default function HeroSection({ currentLang, onOpenConsultation }: HeroSectionProps) {
  const [currentFps, setCurrentFps] = useState<number>(60);

  const t = currentLang === 'uz' ? {
    statusBadge: "2025 YILGI QABUL OCHIQ | CREATIVE TECHNOLOGIST & 3D WEB DEVELOPER",
    headlineLine1: "Raqamli Dunyoda",
    headlineGradient: "3D & Yuqori Texnologik",
    headlineLine2: "Tajribalar Yarataman",
    subtitle: "Three.js, WebGL, Shader san'ati va to'liq arxitektura orqali biznesingizni yangi bosqichga olib chiqaman. Har bir loyiha — interaktiv san'at asari va texnologik yutuq.",
    viewProjects: "Loyihalarni ko'rish",
    bookConsult: "Konsultatsiya olish",
    stat1Number: "45+",
    stat1Label: "Muvaffaqiyatli Loyiha",
    stat2Number: "99.8%",
    stat2Label: "Ishonchlilik & 60 FPS",
    stat3Number: "12+",
    stat3Label: "Awwwards, FWA & Webby",
    buffer: "BUFFER: 4.8MB",
    vertices: "VERTICES: 124K",
  } : {
    statusBadge: "OPEN FOR 2025 PROJECTS | CREATIVE TECHNOLOGIST & 3D WEB DEVELOPER",
    headlineLine1: "Crafting High-Tech",
    headlineGradient: "3D & Immersive",
    headlineLine2: "Digital Experiences",
    subtitle: "Elevating your brand through Three.js, WebGL, custom shader art, and robust cloud architecture. Every project is an interactive masterpiece and engineering breakthrough.",
    viewProjects: "View Projects",
    bookConsult: "Book Consultation",
    stat1Number: "45+",
    stat1Label: "Completed Projects",
    stat2Number: "99.8%",
    stat2Label: "Reliability & 60 FPS",
    stat3Number: "12+",
    stat3Label: "Awwwards, FWA & Webby",
    buffer: "BUFFER: 4.8MB",
    vertices: "VERTICES: 124K",
  };

  return (
    <section className="relative w-full min-h-[760px] lg:h-[840px] flex items-center justify-center overflow-hidden pt-20">
      {/* 3D WebGL Canvas Layer */}
      <Hero3DCanvas onFpsUpdate={setCurrentFps} />

      {/* Ambient Glow Scrim Behind Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111319]/20 via-[#111319]/60 to-[#111319] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#38bdf8]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HUD Overlay Top Bar Context */}
      <div className="absolute top-24 left-0 right-0 px-4 sm:px-8 lg:px-12 flex justify-between items-center pointer-events-none z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#191c21]/80 backdrop-blur-xl border border-white/5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase text-[#8ed5ff] tracking-widest">
            SHADER: GLSL v300 // RENDER: {currentFps}FPS
          </span>
        </div>
        <div className="hidden md:inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#191c21]/80 backdrop-blur-xl font-['JetBrains_Mono'] text-[11px] text-[#bdc8d1] border border-white/5 shadow-lg">
          <span className="text-[#c5c9ff]">{t.buffer}</span>
          <span className="opacity-30">•</span>
          <span className="text-[#ddb7ff]">{t.vertices}</span>
        </div>
      </div>

      {/* Overlaid Interactive Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none pt-10 pb-16">
        <div className="max-w-4xl flex flex-col gap-5">
          {/* Status Badge */}
          <div className="self-start inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#191c21]/80 backdrop-blur-2xl border border-white/10 shadow-xl pointer-events-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#38bdf8]" />
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] sm:text-xs text-[#e2e2ea] font-semibold tracking-wider uppercase">
              {t.statusBadge}
            </span>
          </div>

          {/* Giant Futuristic Display Headline */}
          <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#e2e2ea] leading-[1.08] mt-1">
            {t.headlineLine1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ed5ff] via-[#38bdf8] to-[#ddb7ff]">
              {t.headlineGradient}
            </span>{' '}
            {t.headlineLine2}
          </h1>

          {/* Engaging Subtitle */}
          <p className="font-['Geist'] text-base sm:text-lg text-[#bdc8d1] max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 pointer-events-auto">
            <a
              href="#tanlangan-loyihalar"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#38bdf8] to-[#7bd0ff] text-[#00354a] font-['Space_Grotesk'] text-sm font-bold shadow-[0_0_24px_rgba(56,189,248,0.4)] hover:shadow-[0_0_32px_rgba(56,189,248,0.7)] hover:scale-105 transition-all duration-200"
            >
              <span>{t.viewProjects}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#282a30]/80 hover:bg-[#33353b] text-[#8ed5ff] font-['Space_Grotesk'] text-sm font-semibold backdrop-blur-xl border border-white/10 shadow-lg transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>{t.bookConsult}</span>
            </button>
          </div>

          {/* Telemetry Stats Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 max-w-2xl pointer-events-auto">
            <div className="p-4 rounded-xl bg-[#191c21]/70 backdrop-blur-xl border border-white/5 shadow-md">
              <div className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#8ed5ff]">
                {t.stat1Number}
              </div>
              <div className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1] uppercase mt-1">
                {t.stat1Label}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#191c21]/70 backdrop-blur-xl border border-white/5 shadow-md">
              <div className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#c5c9ff]">
                {t.stat2Number}
              </div>
              <div className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1] uppercase mt-1">
                {t.stat2Label}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#191c21]/70 backdrop-blur-xl border border-white/5 shadow-md">
              <div className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#ddb7ff]">
                {t.stat3Number}
              </div>
              <div className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1] uppercase mt-1">
                {t.stat3Label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
