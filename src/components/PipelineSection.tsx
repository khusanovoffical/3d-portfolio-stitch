import { useState } from 'react';

interface PipelineSectionProps {
  currentLang: 'uz' | 'en';
}

export default function PipelineSection({ currentLang }: PipelineSectionProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const t = currentLang === 'uz' ? {
    kicker: "[ ENGINE & PIPELINE MATRIX ]",
    title: "Amaldagi Texnologik Arsenal",
    desc: "Yuqori aniqlikdagi 3D grafika, kompyuter ko'rish va mustahkam bulutli infratuzilmani yaratish uchun foydalaniladigan asboblar majmuasi.",
    pipelineTitle: "3D Rendering & Shading Pipeline Flow",
    pipelineSubtitle: "Browser Thread, GPU Buffer Allocation & Post-Processing Stack",
    fpsLabel: "REALTIME FPS MONITOR: 60.0 STABLE",
    node1: "DRACO Decode",
    node2: "GLSL Vertex Shader",
    node3: "PBR Lighting Passes",
    node4: "Screen Output 60FPS",
  } : {
    kicker: "[ ENGINE & PIPELINE MATRIX ]",
    title: "Active Technology Arsenal",
    desc: "High-precision computer graphics tooling, shader engineering, and scalable cloud foundations deployed in production.",
    pipelineTitle: "3D Rendering & Shading Pipeline Flow",
    pipelineSubtitle: "Browser Thread, GPU Buffer Allocation & Post-Processing Stack",
    fpsLabel: "REALTIME FPS MONITOR: 60.0 STABLE",
    node1: "DRACO Decode",
    node2: "GLSL Vertex Shader",
    node3: "PBR Lighting Passes",
    node4: "Screen Output 60FPS",
  };

  const techStack = [
    { name: "Three.js", version: "/ R160+", color: "bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]", info: "Core 3D engine, custom scenes, raycasting & cameras" },
    { name: "WebGL 2.0", version: "/ Shaders", color: "bg-[#ddb7ff] shadow-[0_0_8px_#ddb7ff]", info: "Direct hardware acceleration & low-level GPU control" },
    { name: "WebGPU", version: "/ WGSL Next-gen", color: "bg-[#c5c9ff] shadow-[0_0_8px_#c5c9ff]", info: "Next-generation parallel compute & raytracing capabilities" },
    { name: "GLSL Custom Shaders", version: "", color: "bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]", info: "Mathematical wave functions, noise fields, and volumetric fog" },
    { name: "React / Next.js 15", version: "", color: "bg-[#7bd0ff]", info: "App routing, server components, and dynamic client hydrate" },
    { name: "Blender 3D Modeling", version: "", color: "bg-[#f0dbff]", info: "PBR materials, normal maps, UV baking & low-poly retopology" },
    { name: "TypeScript", version: "", color: "bg-[#8ed5ff]", info: "100% strict type safety across graphics & API models" },
    { name: "Node.js & Microservices", version: "", color: "bg-[#a3abff]", info: "WebSocket gateways and asset serialization workers" },
    { name: "GSAP ScrollTrigger", version: "", color: "bg-[#7bd0ff]", info: "Choreographed timeline camera animations tied to viewport scroll" },
    { name: "Tailwind CSS v4", version: "", color: "bg-[#ddb7ff]", info: "Modern high-performance zero-runtime design tokens" },
  ];

  return (
    <section className="w-full py-20 bg-[#111319] relative z-10 overflow-hidden" id="pipeline">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase tracking-widest">
            {t.kicker}
          </span>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e2e2ea]">
            {t.title}
          </h2>
          <p className="font-['Geist'] text-sm sm:text-base text-[#bdc8d1]">
            {t.desc}
          </p>
        </div>

        {/* Visual Interactive Tech Chips */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto">
          {techStack.map((tech) => (
            <button
              key={tech.name}
              onClick={() => setSelectedTech(selectedTech === tech.name ? null : tech.name)}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer border ${
                selectedTech === tech.name
                  ? 'bg-[#282a30] border-[#38bdf8] shadow-[0_0_16px_rgba(56,189,248,0.3)]'
                  : 'bg-[#191c21] hover:bg-[#1d2025] border-white/5 hover:border-white/15'
              }`}
              type="button"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${tech.color}`} />
              <span className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#e2e2ea] font-semibold">
                {tech.name}
              </span>
              {tech.version && (
                <span className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1]">
                  {tech.version}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Telemetry info pill if a tech is selected */}
        {selectedTech && (
          <div className="max-w-md mx-auto p-3.5 rounded-xl bg-[#191c21] border border-[#38bdf8]/40 shadow-lg text-center animate-in fade-in zoom-in-95 duration-200">
            <span className="font-['JetBrains_Mono'] text-xs text-[#38bdf8] font-bold block mb-1">
              [ {selectedTech} ]
            </span>
            <p className="font-['Geist'] text-xs text-[#bdc8d1]">
              {techStack.find(t => t.name === selectedTech)?.info}
            </p>
          </div>
        )}

        {/* Inline Telemetry Architecture Diagram SVG */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#191c21] border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
            <div>
              <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2ea]">
                {t.pipelineTitle}
              </h4>
              <p className="font-['Geist'] text-xs sm:text-sm text-[#bdc8d1]">
                {t.pipelineSubtitle}
              </p>
            </div>
            <span className="font-['JetBrains_Mono'] text-xs px-3 py-1.5 rounded-md bg-[#282a30] text-[#38bdf8] border border-[#38bdf8]/20">
              {t.fpsLabel}
            </span>
          </div>

          {/* Custom Telemetry Visualization Graph */}
          <div className="w-full overflow-x-auto py-4">
            <svg
              className="w-full min-w-[640px] h-36"
              fill="none"
              viewBox="0 0 800 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Reference Track */}
              <path
                className="text-[#33353b]"
                d="M 0 60 Q 100 20 200 60 T 400 60 T 600 60 T 800 60"
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth="2"
              />

              {/* Dynamic Gradient Energy Path */}
              <path
                className="text-[#38bdf8]"
                d="M 0 60 C 150 10, 250 110, 400 60 C 550 10, 650 110, 800 60"
                stroke="currentColor"
                strokeWidth="3"
              />

              {/* Node 1: DRACO */}
              <circle className="fill-[#38bdf8] animate-ping" cx="100" cy="35" opacity="0.3" r="6" />
              <circle className="fill-[#38bdf8]" cx="100" cy="35" r="4.5" />
              <text className="fill-[#bdc8d1] text-[11px] font-mono" textAnchor="middle" x="100" y="18">
                {t.node1}
              </text>

              {/* Node 2: GLSL */}
              <circle className="fill-[#ddb7ff]" cx="300" cy="85" r="4.5" />
              <text className="fill-[#bdc8d1] text-[11px] font-mono" textAnchor="middle" x="300" y="110">
                {t.node2}
              </text>

              {/* Node 3: PBR */}
              <circle className="fill-[#c5c9ff]" cx="500" cy="35" r="4.5" />
              <text className="fill-[#bdc8d1] text-[11px] font-mono" textAnchor="middle" x="500" y="18">
                {t.node3}
              </text>

              {/* Node 4: Output */}
              <circle className="fill-[#38bdf8] animate-ping" cx="700" cy="85" opacity="0.4" r="6" />
              <circle className="fill-[#38bdf8]" cx="700" cy="85" r="4.5" />
              <text className="fill-[#bdc8d1] text-[11px] font-mono" textAnchor="middle" x="700" y="110">
                {t.node4}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
