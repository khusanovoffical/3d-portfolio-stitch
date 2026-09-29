import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. CAR CONFIGURATOR MODAL WITH REAL THREE.JS SCENE
// ----------------------------------------------------
interface CarConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: 'uz' | 'en';
}

export function CarConfigModal({ isOpen, onClose, currentLang }: CarConfigModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [paintColor, setPaintColor] = useState('#0284c7');
  const [finish, setFinish] = useState<'metallic' | 'matte' | 'gloss'>('metallic');
  const [neonActive, setNeonActive] = useState(true);
  const [spoilerActive, setSpoilerActive] = useState(true);
  const [wheelType, setWheelType] = useState<'forged' | 'aero' | 'gt'>('forged');
  const [savedToast, setSavedToast] = useState(false);

  const colors = [
    { name: 'Electric Cyan', hex: '#0284c7' },
    { name: 'Obsidian Black', hex: '#0a0b0e' },
    { name: 'Neon Purple', hex: '#7c3aed' },
    { name: 'Solar Apex Red', hex: '#e11d48' },
    { name: 'Liquid Silver', hex: '#cbd5e1' },
    { name: 'Champagne Gold', hex: '#d97706' },
  ];

  // Three.js interactive 3D Car Model simulation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const container = canvasRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0e13);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4, 2.2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Reflective Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111319,
      roughness: 0.2,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);

    // Grid on floor
    const grid = new THREE.GridHelper(20, 20, 0x38bdf8, 0x1d2025);
    grid.position.y = -0.49;
    scene.add(grid);

    // Car group
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Car Body Material
    const carMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintColor),
      metalness: finish === 'metallic' ? 0.9 : finish === 'matte' ? 0.2 : 0.6,
      roughness: finish === 'metallic' ? 0.2 : finish === 'matte' ? 0.8 : 0.1,
      clearcoat: finish === 'metallic' ? 1.0 : 0.0,
      clearcoatRoughness: 0.1,
    });

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(3.2, 0.65, 1.5);
    const chassis = new THREE.Mesh(chassisGeo, carMaterial);
    chassis.position.y = 0.2;
    carGroup.add(chassis);

    // Cabin / Cockpit Roof
    const roofGeo = new THREE.BoxGeometry(1.6, 0.55, 1.25);
    const roofMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.5,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(-0.2, 0.75, 0);
    carGroup.add(roof);

    // Hood scoop
    const hoodGeo = new THREE.BoxGeometry(1.1, 0.15, 1.3);
    const hood = new THREE.Mesh(hoodGeo, carMaterial);
    hood.position.set(0.9, 0.45, 0);
    carGroup.add(hood);

    // Rear Spoiler
    const spoilerGeo = new THREE.BoxGeometry(0.3, 0.08, 1.45);
    const spoilerMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
    spoiler.position.set(-1.45, 0.85, 0);
    spoiler.visible = spoilerActive;
    carGroup.add(spoiler);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 24);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: wheelType === 'aero' ? 0x222222 : 0x444444,
      metalness: wheelType === 'forged' ? 0.9 : 0.5,
      roughness: 0.3,
    });

    const wheelPositions = [
      [1.0, 0, 0.8],
      [1.0, 0, -0.8],
      [-1.0, 0, 0.8],
      [-1.0, 0, -0.8],
    ];

    const wheels: THREE.Mesh[] = [];
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(pos[0], pos[1], pos[2]);
      carGroup.add(wheel);
      wheels.push(wheel);
    });

    // Headlights
    const lightGeo = new THREE.BoxGeometry(0.08, 0.15, 0.35);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x8ed5ff });
    const leftLight = new THREE.Mesh(lightGeo, lightMat);
    leftLight.position.set(1.61, 0.25, 0.45);
    const rightLight = new THREE.Mesh(lightGeo, lightMat);
    rightLight.position.set(1.61, 0.25, -0.45);
    carGroup.add(leftLight);
    carGroup.add(rightLight);

    // Neon underglow
    const neonLight = new THREE.PointLight(0x0284c7, neonActive ? 3.0 : 0, 4);
    neonLight.position.set(0, -0.2, 0);
    carGroup.add(neonLight);

    // Orbit Controls manual drag
    let isDragging = false;
    let prevMouseX = 0;
    let rotationAngle = 0.5;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const delta = e.clientX - prevMouseX;
        rotationAngle += delta * 0.01;
        prevMouseX = e.clientX;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        rotationAngle += 0.005;
      }
      carGroup.rotation.y = rotationAngle;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [isOpen, paintColor, finish, neonActive, spoilerActive, wheelType]);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#191c21] border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">directions_car</span>
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#e2e2ea]">
                AURA LUXURY CAR CONFIGURATOR // 3D PBR
              </h3>
              <p className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff]">
                Real-time WebGL Raytracing & Shader Customizer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#282a30] text-[#bdc8d1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6">
          {/* 3D Viewport */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div
              ref={canvasRef}
              className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-[#0c0e13] border border-white/10 cursor-grab active:cursor-grabbing relative"
            >
              <div className="absolute top-3 left-3 px-3 py-1 rounded bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[11px] text-[#38bdf8] border border-white/5 pointer-events-none">
                360° Drag to Orbit
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[11px] text-[#c5c9ff] border border-white/5 pointer-events-none">
                PBR Engine: R160+
              </div>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-[#111319] border border-white/5 font-['JetBrains_Mono'] text-xs">
              <div>
                <span className="text-[#87929a] block text-[10px]">0-100 KM/H</span>
                <span className="text-[#38bdf8] font-bold text-sm">2.8s</span>
              </div>
              <div>
                <span className="text-[#87929a] block text-[10px]">MAX SPEED</span>
                <span className="text-[#ddb7ff] font-bold text-sm">340 km/h</span>
              </div>
              <div>
                <span className="text-[#87929a] block text-[10px]">DOWNFORCE</span>
                <span className="text-[#8ed5ff] font-bold text-sm">+380 kg</span>
              </div>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Color Swatches */}
            <div>
              <label className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block mb-2 font-semibold">
                1. Tashqi rang (Exterior Paint)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setPaintColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      paintColor === c.hex ? 'scale-125 border-[#38bdf8] shadow-[0_0_12px_#38bdf8]' : 'border-white/20 hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Finish Type */}
            <div>
              <label className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block mb-2 font-semibold">
                2. Bo'yoq xususiyati (Finish)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['metallic', 'matte', 'gloss'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`py-2 px-3 rounded-lg font-['JetBrains_Mono'] text-xs capitalize transition-colors cursor-pointer border ${
                      finish === f
                        ? 'bg-[#38bdf8] text-[#00354a] font-bold border-[#38bdf8]'
                        : 'bg-[#282a30] text-[#bdc8d1] border-white/5 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Wheels */}
            <div>
              <label className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block mb-2 font-semibold">
                3. Diskalar (Wheel Package)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'forged', label: 'Forged 20"' },
                  { id: 'aero', label: 'Carbon Aero' },
                  { id: 'gt', label: 'GT Spoke' },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWheelType(w.id as any)}
                    className={`py-2 px-2 text-center rounded-lg font-['JetBrains_Mono'] text-xs transition-colors cursor-pointer border ${
                      wheelType === w.id
                        ? 'bg-[#c5c9ff] text-[#131e8c] font-bold border-[#c5c9ff]'
                        : 'bg-[#282a30] text-[#bdc8d1] border-white/5 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aero & Light Toggles */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#111319] border border-white/5 cursor-pointer">
                <span className="font-['Geist'] text-xs text-[#e2e2ea]">Karbon orqa qanot (Active Spoiler)</span>
                <input
                  type="checkbox"
                  checked={spoilerActive}
                  onChange={(e) => setSpoilerActive(e.target.checked)}
                  className="w-4 h-4 accent-[#38bdf8]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#111319] border border-white/5 cursor-pointer">
                <span className="font-['Geist'] text-xs text-[#e2e2ea]">Tag qism neon nuri (Cyber Underglow)</span>
                <input
                  type="checkbox"
                  checked={neonActive}
                  onChange={(e) => setNeonActive(e.target.checked)}
                  className="w-4 h-4 accent-[#38bdf8]"
                />
              </label>
            </div>

            {/* Save & Action */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#7bd0ff] text-[#00354a] font-['Space_Grotesk'] text-sm font-bold shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Konfiguratsiyani saqlash
              </button>
              {savedToast && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs text-center font-['JetBrains_Mono'] border border-emerald-500/30 animate-in fade-in">
                  ✓ Konfiguratsiya saqlandi va eksportga tayyorlandi!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. CYBERPUNK METAVERSE DEMO MODAL
// ----------------------------------------------------
interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CyberModal({ isOpen, onClose }: CyberModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'free' | 'drone' | 'iso'>('free');

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070a);
    scene.fog = new THREE.FogExp2(0x06070a, 0.05);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Neon Grid
    const grid = new THREE.GridHelper(40, 40, 0x38bdf8, 0x9333ea);
    grid.position.y = -1;
    scene.add(grid);

    // Neon floating towers
    const towerGroup = new THREE.Group();
    scene.add(towerGroup);
    const boxGeo = new THREE.BoxGeometry(1.2, 5, 1.2);

    for (let i = 0; i < 20; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x0284c7 : 0xa855f7,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      const angle = (i / 20) * Math.PI * 2;
      const dist = 6 + Math.random() * 8;
      mesh.position.set(Math.cos(angle) * dist, 1.5, Math.sin(angle) * dist);
      mesh.scale.y = 0.5 + Math.random() * 1.5;
      towerGroup.add(mesh);
    }

    // Central holographic asset
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.4, 0.35, 100, 16);
    const torusKnotMat = new THREE.MeshNormalMaterial({ wireframe: true });
    const knot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    knot.position.set(0, 2, 0);
    scene.add(knot);

    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.01;
      knot.rotation.x = time * 0.8;
      knot.rotation.y = time * 0.5;

      if (viewMode === 'drone') {
        camera.position.x = Math.sin(time * 0.5) * 12;
        camera.position.z = Math.cos(time * 0.5) * 12;
        camera.position.y = 5 + Math.sin(time) * 2;
        camera.lookAt(0, 1, 0);
      } else if (viewMode === 'iso') {
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.set(0, 3, 10);
        camera.lookAt(0, 1.5, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isOpen, viewMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#191c21] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2ea]">
              CYBERPUNK METAVERSE 2025 // LIVE INTERACTIVE WEBGL
            </h3>
            <span className="font-['JetBrains_Mono'] text-xs text-[#38bdf8]">
              Spatial Audio & Procedural Matrix
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#282a30] text-[#bdc8d1] hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div
            ref={containerRef}
            className="w-full h-[400px] rounded-2xl bg-[#06070a] overflow-hidden border border-white/10 relative"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1]">Kamera rejimi:</span>
              <button
                onClick={() => setViewMode('free')}
                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs cursor-pointer ${
                  viewMode === 'free' ? 'bg-[#38bdf8] text-[#00354a] font-bold' : 'bg-[#282a30] text-[#bdc8d1]'
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setViewMode('drone')}
                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs cursor-pointer ${
                  viewMode === 'drone' ? 'bg-[#38bdf8] text-[#00354a] font-bold' : 'bg-[#282a30] text-[#bdc8d1]'
                }`}
              >
                Drone Orbit
              </button>
              <button
                onClick={() => setViewMode('iso')}
                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs cursor-pointer ${
                  viewMode === 'iso' ? 'bg-[#38bdf8] text-[#00354a] font-bold' : 'bg-[#282a30] text-[#bdc8d1]'
                }`}
              >
                Isometric 3D
              </button>
            </div>

            <span className="font-['JetBrains_Mono'] text-xs text-emerald-400">
              ● RENDER: 60.0 FPS STABLE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. NEURAL FINTECH DEMO MODAL
// ----------------------------------------------------
interface FintechModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FintechModal({ isOpen, onClose }: FintechModalProps) {
  const [nodesCount, setNodesCount] = useState(128400);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#191c21] border border-white/10 shadow-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c5c9ff] text-[24px]">terminal</span>
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2ea]">
                NEURAL FINTECH DASHBOARD // REAL-TIME NODES
              </h3>
              <p className="font-['JetBrains_Mono'] text-xs text-[#c5c9ff]">
                Sub-14ms Latency Streaming Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#282a30] text-[#bdc8d1] hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Live Simulation Canvas Card */}
        <div className="h-[280px] w-full rounded-2xl bg-[#0c0e13] border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="flex justify-between items-center z-10">
            <span className="font-['JetBrains_Mono'] text-xs text-[#38bdf8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              WEBSOCKET GATEWAY: CONNECTED
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1]">
              CLUSTER DENSITY: {nodesCount.toLocaleString()} NODES
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 z-10">
            {[
              { pair: 'BTC / USD', price: '$89,450.20', change: '+4.2%' },
              { pair: 'ETH / USD', price: '$3,240.50', change: '+2.8%' },
              { pair: 'SOL / USD', price: '$188.75', change: '+6.1%' },
              { pair: 'GLSL / WGSL', price: '0.002ms', change: 'GPU COMPUTE' },
            ].map((t) => (
              <div key={t.pair} className="p-3 rounded-xl bg-[#191c21]/80 border border-white/5">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#87929a] block">{t.pair}</span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#e2e2ea] block mt-0.5">{t.price}</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-emerald-400">{t.change}</span>
              </div>
            ))}
          </div>

          <div className="z-10 flex items-center justify-between text-xs text-[#bdc8d1] font-['JetBrains_Mono'] pt-2">
            <span>PING: 11ms</span>
            <span>DRACO BUFFER: 1.2MB</span>
            <span>HEAP: 42MB</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1]">Klaster oqimi:</span>
            <button
              onClick={() => setNodesCount((prev) => prev + 10000)}
              className="px-3 py-1.5 rounded-lg bg-[#282a30] hover:bg-[#33353b] text-xs font-['JetBrains_Mono'] text-[#38bdf8] transition-colors"
            >
              +10K Tugunlar
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#c5c9ff] text-[#131e8c] font-['Space_Grotesk'] font-bold text-xs hover:bg-white transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. TECHNICAL DOCUMENTATION DRAWER MODAL
// ----------------------------------------------------
interface TechDocsModalProps {
  isOpen: boolean;
  projectName: string | null;
  onClose: () => void;
}

export function TechDocsModal({ isOpen, projectName, onClose }: TechDocsModalProps) {
  if (!isOpen || !projectName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#191c21] border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block">
              // ARCHITECTURE & PIPELINE SPEC
            </span>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2ea]">
              {projectName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#282a30] text-[#bdc8d1] hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 font-['Geist'] text-xs sm:text-sm text-[#bdc8d1] max-h-[60vh] overflow-y-auto pr-2">
          <div className="p-4 rounded-xl bg-[#111319] border border-white/5 flex flex-col gap-2">
            <h4 className="font-['Space_Grotesk'] font-bold text-[#e2e2ea] text-sm">
              Rendering & Shading texnologiyasi:
            </h4>
            <p>
              Ushbu loyihada WebGL 2.0 va Three.js R160+ asosida custom GLSL vertex hamda fragment shaderlari yozilgan. Ob'ektlar DRACO geometriyalari bilan 85% gacha siqilgan bo'lib, mobil internetda ham 1 soniyadan kam vaqtda to'liq yuklanadi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111319] border border-white/5 flex flex-col gap-2 font-['JetBrains_Mono'] text-xs">
            <span className="text-[#38bdf8] font-bold">// GLSL Vertex Transform Matrix Snippet:</span>
            <pre className="text-[#bdc8d1] overflow-x-auto p-2 bg-[#0c0e13] rounded">
{`uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 pos = position;
  pos.y += sin(pos.x * 2.0 + uTime) * 0.15;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-['JetBrains_Mono']">
            <div className="p-3 rounded-lg bg-[#282a30]">
              <span className="text-[#87929a] block">FPS STABILITY</span>
              <span className="text-[#38bdf8] font-bold">60.0 FPS Locked</span>
            </div>
            <div className="p-3 rounded-lg bg-[#282a30]">
              <span className="text-[#87929a] block">DRACO COMPRESSION</span>
              <span className="text-[#ddb7ff] font-bold">14.2MB → 1.8MB</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#282a30] hover:bg-[#33353b] text-[#e2e2ea] font-['Space_Grotesk'] font-bold text-sm transition-colors"
        >
          Hujjatni yopish
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. CONSULTATION / PROJECT BRIEF MODAL
// ----------------------------------------------------
interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: 'uz' | 'en';
}

export function ConsultationModal({ isOpen, onClose, currentLang }: ConsultationModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [projectType, setProjectType] = useState('3d_website');
  const [budget, setBudget] = useState('$1,500 - $3,000');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#191c21] border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block">
              // LOYIHANI BOSHLASH
            </span>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2ea]">
              {currentLang === 'uz' ? "Konsultatsiya & Loyiha Anketasi" : "Project Consultation Brief"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#282a30] text-[#bdc8d1] hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2ea]">
              Murojaatingiz qabul qilindi!
            </h4>
            <p className="font-['Geist'] text-xs text-[#bdc8d1] max-w-xs">
              Tez orada siz bilan Telegram yoki elektron pochta orqali bog'lanamiz. O'rtacha kutish vaqti: 2 soat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-['Geist'] text-xs">
            <div>
              <label className="block text-[#bdc8d1] mb-1 font-['JetBrains_Mono']">Ismingiz yoki Kompaniya:</label>
              <input
                required
                type="text"
                placeholder="Azizbek / Nexus Labs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111319] border border-white/10 text-[#e2e2ea] placeholder-[#87929a] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="block text-[#bdc8d1] mb-1 font-['JetBrains_Mono']">Aloqa (Telegram yoki Email):</label>
              <input
                required
                type="text"
                placeholder="@username yoki info@company.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111319] border border-white/10 text-[#e2e2ea] placeholder-[#87929a] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#bdc8d1] mb-1 font-['JetBrains_Mono']">Loyiha turi:</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111319] border border-white/10 text-[#e2e2ea] focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="3d_website">Interaktiv 3D Sayt</option>
                  <option value="car_config">WebGL Konfigurator</option>
                  <option value="fintech_dashboard">3D Ma'lumot Vizualizatsiyasi</option>
                  <option value="fullstack">To'liq Full-Stack Platforma</option>
                </select>
              </div>

              <div>
                <label className="block text-[#bdc8d1] mb-1 font-['JetBrains_Mono']">Byudjet rejasi:</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111319] border border-white/10 text-[#e2e2ea] focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000+">$5,000+ (Enterprise)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#bdc8d1] mb-1 font-['JetBrains_Mono']">Qisqacha g'oyangiz:</label>
              <textarea
                rows={3}
                placeholder="Yangi 3D brend sayt yaratmoqchimiz, Three.js va interaktiv animatsiyalar bilan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111319] border border-white/10 text-[#e2e2ea] placeholder-[#87929a] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#7bd0ff] text-[#00354a] font-['Space_Grotesk'] text-sm font-bold shadow-lg hover:shadow-[#38bdf8]/40 hover:scale-[1.01] transition-all cursor-pointer"
            >
              Yuborish & Bepul Konsultatsiya olish
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
