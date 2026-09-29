import { useState } from 'react';

interface ExpertiseSectionProps {
  currentLang: 'uz' | 'en';
}

interface ExpertiseItem {
  id: string;
  tagNumber: string;
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  colorClass: string;
  badgeColor: string;
  details: {
    specs: string[];
    benchmark: string;
    descriptionExtended: string;
  };
}

export default function ExpertiseSection({ currentLang }: ExpertiseSectionProps) {
  const [selectedItem, setSelectedItem] = useState<ExpertiseItem | null>(null);

  const t = currentLang === 'uz' ? {
    kicker: "[ SYSTEM // ARCHITECTURE ]",
    title: "Mening Yondashuvim & 3D Ekspertiza",
    desc: "Vizual estetika va murakkab kompyuter grafikasi qonuniyatlarini mukammal muhandislik bilan birlashtiruvchi ko'nikmalar matritsasi.",
    close: "Yopish",
    specsLabel: "Asosiy parametrlar & Texnologiyalar:",
    benchmarkLabel: "Ishlash ko'rsatkichi:",
  } : {
    kicker: "[ SYSTEM // ARCHITECTURE ]",
    title: "Core Philosophy & 3D Expertise",
    desc: "A matrix of multidisciplinary skills uniting visual aesthetics, advanced computer graphics principles, and battle-tested engineering.",
    close: "Close",
    specsLabel: "Key Specifications & Tooling:",
    benchmarkLabel: "Performance Benchmark:",
  };

  const items: ExpertiseItem[] = currentLang === 'uz' ? [
    {
      id: 'webgl',
      tagNumber: "01 // WebGL & Shaderlar",
      title: "Immersive 3D & WebGL",
      desc: "Three.js, GLSL Custom Shaderlar, procedurally generated muhitlar va har qanday qurilmada barqaror 60fps silliq renderlash.",
      tags: ["Three.js", "GLSL", "Raymarching"],
      icon: "view_in_ar",
      colorClass: "text-[#8ed5ff] group-hover:bg-[#8ed5ff] group-hover:text-[#00354a]",
      badgeColor: "text-[#8ed5ff] bg-[#282a30]",
      details: {
        specs: ["Custom fragment & vertex shaders", "Procedural noise & instanced rendering", "Dynamic bloom & depth-of-field post-processing"],
        benchmark: "60 FPS stable @ 4K display, <5ms frame render time",
        descriptionExtended: "Har bir 3D sahna GPU xotirasiga to'g'ridan-to'g'ri bog'langan. GLSL shaderlari orqali yorug'lik nurlari, suv to'lqinlari, yulduzlar changi kabi murakkab effektlar protsessorga ortiqcha yuk tushirmasdan hisoblanadi."
      }
    },
    {
      id: 'fullstack',
      tagNumber: "02 // Arxitektura",
      title: "Full-Stack Arxitektura",
      desc: "Next.js, Node.js, WebSockets va Cloud infratuzilma. Katta yuklamalarga chidamli, himoyalangan va global miqyosda kengayuvchan tizimlar.",
      tags: ["Next.js", "Node", "Postgres"],
      icon: "dns",
      colorClass: "text-[#c5c9ff] group-hover:bg-[#c5c9ff] group-hover:text-[#131e8c]",
      badgeColor: "text-[#c5c9ff] bg-[#282a30]",
      details: {
        specs: ["Server-Side Rendering & Edge caching", "Real-time bi-directional WebSockets", "PostgreSQL database & ACID transactions"],
        benchmark: "TTFB < 50ms, 99.99% uptime global CDN orqali",
        descriptionExtended: "Faqat chiroyli 3D emas, balki orqasida mustahkam backend turgan to'liq xizmat. Foydalanuvchi ma'lumotlari xavfsiz shifrlanadi va real vaqtda sinxronlashadi."
      }
    },
    {
      id: 'design',
      tagNumber: "03 // Dizayn Muhandisligi",
      title: "UI/UX & Creative Direction",
      desc: "Foydalanuvchi his-tuyg'ularini uyg'otuvchi noan'anaviy tipografiya, kinetik micro-interaksiyalar va qulay ergonomik interfeyslar.",
      tags: ["Figma", "GSAP", "Motion"],
      icon: "magic_button",
      colorClass: "text-[#ddb7ff] group-hover:bg-[#ddb7ff] group-hover:text-[#490080]",
      badgeColor: "text-[#ddb7ff] bg-[#282a30]",
      details: {
        specs: ["Design tokens & custom typography system", "Physical spring animations with Framer Motion", "Awwwards-grade layout and visual rhythm"],
        benchmark: "Foydalanuvchilar o'rtacha sessiya davomiyligi +280%",
        descriptionExtended: "Har bir tugma bosilishi, sahifa almashinishi va kursor harakati nozik tebranish va tovush bilan javob beradi. Interfeys jonli organizm kabi seziladi."
      }
    },
    {
      id: 'performance',
      tagNumber: "04 // Ishlash Tezligi",
      title: "Optimizatsiya & WebGPU",
      desc: "DRACO/Meshopt 3D model kompressiyasi, past kechikishdagi rendering va WebGPU hisoblash quvvati orqali 0.8 soniyalik yuklanish.",
      tags: ["WebGPU", "DRACO", "Lighthouse 99"],
      icon: "speed",
      colorClass: "text-[#38bdf8] group-hover:bg-[#38bdf8] group-hover:text-[#004965]",
      badgeColor: "text-[#38bdf8] bg-[#282a30]",
      details: {
        specs: ["Draco geometry compression (85% reduction)", "Texture KTX2 / Basis Universal encoding", "WebGPU compute shaders for parallel physics"],
        benchmark: "Lighthouse Performance: 99/100, FCP 0.6s",
        descriptionExtended: "Katta hajmli 3D modellarni ham mobil telefonda soniyalar ichida yuklash uchun zamonaviy geometriya va tekstura siqish algoritmlari qo'llaniladi."
      }
    }
  ] : [
    {
      id: 'webgl',
      tagNumber: "01 // WebGL & Shaders",
      title: "Immersive 3D & WebGL",
      desc: "Three.js, GLSL Custom Shaders, procedural worlds, and silky-smooth 60fps across every device.",
      tags: ["Three.js", "GLSL", "Raymarching"],
      icon: "view_in_ar",
      colorClass: "text-[#8ed5ff] group-hover:bg-[#8ed5ff] group-hover:text-[#00354a]",
      badgeColor: "text-[#8ed5ff] bg-[#282a30]",
      details: {
        specs: ["Custom fragment & vertex shaders", "Procedural noise & instanced rendering", "Dynamic bloom & depth-of-field post-processing"],
        benchmark: "60 FPS stable @ 4K display, <5ms frame render time",
        descriptionExtended: "Each 3D scene directly binds GPU buffers, eliminating CPU bottlenecks while providing lifelike reflections and spatial light passes."
      }
    },
    {
      id: 'fullstack',
      tagNumber: "02 // Architecture",
      title: "Full-Stack Architecture",
      desc: "Next.js, Node.js, WebSockets, and Cloud infrastructure built for high concurrency and zero downtime.",
      tags: ["Next.js", "Node", "Postgres"],
      icon: "dns",
      colorClass: "text-[#c5c9ff] group-hover:bg-[#c5c9ff] group-hover:text-[#131e8c]",
      badgeColor: "text-[#c5c9ff] bg-[#282a30]",
      details: {
        specs: ["Server-Side Rendering & Edge caching", "Real-time bi-directional WebSockets", "PostgreSQL database & ACID transactions"],
        benchmark: "TTFB < 50ms, 99.99% uptime via global edge networks",
        descriptionExtended: "Comprehensive full-stack systems that back high-fidelity visuals with robust, horizontally scalable APIs."
      }
    },
    {
      id: 'design',
      tagNumber: "03 // Design Engineering",
      title: "UI/UX & Creative Direction",
      desc: "Evocative typography, kinetic micro-interactions, and ergonomic spatial interfaces designed to inspire.",
      tags: ["Figma", "GSAP", "Motion"],
      icon: "magic_button",
      colorClass: "text-[#ddb7ff] group-hover:bg-[#ddb7ff] group-hover:text-[#490080]",
      badgeColor: "text-[#ddb7ff] bg-[#282a30]",
      details: {
        specs: ["Design tokens & custom typography system", "Physical spring animations with Framer Motion", "Awwwards-grade layout and visual rhythm"],
        benchmark: "Average session duration increased by +280%",
        descriptionExtended: "Interfaces that respond organically to tactile and spatial interactions, turning digital tools into emotional experiences."
      }
    },
    {
      id: 'performance',
      tagNumber: "04 // Velocity & Speed",
      title: "Optimization & WebGPU",
      desc: "DRACO/Meshopt 3D compression, low-latency rendering pipeline, and WebGPU compute shaders for 0.8s load times.",
      tags: ["WebGPU", "DRACO", "Lighthouse 99"],
      icon: "speed",
      colorClass: "text-[#38bdf8] group-hover:bg-[#38bdf8] group-hover:text-[#004965]",
      badgeColor: "text-[#38bdf8] bg-[#282a30]",
      details: {
        specs: ["Draco geometry compression (85% reduction)", "Texture KTX2 / Basis Universal encoding", "WebGPU compute shaders for parallel physics"],
        benchmark: "Lighthouse Performance: 99/100, FCP 0.6s",
        descriptionExtended: "Ultra-lean asset delivery pipelines that stream high-polygon models to smartphones without thermal throttling."
      }
    }
  ];

  return (
    <section className="w-full py-20 bg-[#111319] relative z-10" id="ekspertiza">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-[#8ed5ff] font-['JetBrains_Mono'] text-xs uppercase tracking-widest">
              <span>{t.kicker}</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e2e2ea]">
              {t.title}
            </h2>
          </div>
          <p className="font-['Geist'] text-sm sm:text-base text-[#bdc8d1] max-w-md">
            {t.desc}
          </p>
        </div>

        {/* Bento-style Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-6 rounded-xl bg-[#191c21] hover:bg-[#1d2025] border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between group shadow-xl cursor-pointer hover:-translate-y-1"
            >
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-lg bg-[#282a30] flex items-center justify-center transition-colors ${item.colorClass}`}>
                  <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                </div>
                <span className={`font-['JetBrains_Mono'] text-xs uppercase ${item.tagNumber.includes('01') ? 'text-[#8ed5ff]' : item.tagNumber.includes('02') ? 'text-[#c5c9ff]' : item.tagNumber.includes('03') ? 'text-[#ddb7ff]' : 'text-[#38bdf8]'}`}>
                  {item.tagNumber}
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2ea]">
                  {item.title}
                </h3>
                <p className="font-['Geist'] text-xs sm:text-sm text-[#bdc8d1] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 flex flex-wrap gap-1.5 border-t border-white/5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs ${item.badgeColor} border border-white/5`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expertise Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#191c21] border border-white/10 p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#282a30] flex items-center justify-center text-[#38bdf8]">
                  <span className="material-symbols-outlined text-[24px]">{selectedItem.icon}</span>
                </div>
                <div>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff]">{selectedItem.tagNumber}</span>
                  <h4 className="font-['Space_Grotesk'] font-bold text-lg text-[#e2e2ea]">{selectedItem.title}</h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-[#282a30] text-[#bdc8d1] hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="font-['Geist'] text-sm text-[#bdc8d1] leading-relaxed">
              {selectedItem.details.descriptionExtended}
            </p>

            <div className="bg-[#111319] p-4 rounded-xl border border-white/5 flex flex-col gap-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase font-semibold">
                {t.specsLabel}
              </span>
              <ul className="flex flex-col gap-1.5 text-xs text-[#bdc8d1] font-['Geist']">
                {selectedItem.details.specs.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-between text-xs">
              <span className="text-[#bdc8d1] font-['JetBrains_Mono']">{t.benchmarkLabel}</span>
              <span className="text-[#38bdf8] font-semibold font-['JetBrains_Mono']">{selectedItem.details.benchmark}</span>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 rounded-lg bg-[#282a30] hover:bg-[#33353b] text-[#e2e2ea] font-['Space_Grotesk'] text-sm font-semibold transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
