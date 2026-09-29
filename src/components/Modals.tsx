import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================================================
// 1. AURA LUXURY CAR CONFIGURATOR // ADVANCED 3D PBR SPORTS CAR
// ============================================================================
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
  const [headlightsActive, setHeadlightsActive] = useState(true);
  const [spoilerActive, setSpoilerActive] = useState(true);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [wheelType, setWheelType] = useState<'forged' | 'aero' | 'gt'>('forged');
  const [autoRotate, setAutoRotate] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  // References for live mesh updates without recreating scene
  const carPaintMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const neonLightRef = useRef<THREE.PointLight | null>(null);
  const leftHeadlightConeRef = useRef<THREE.SpotLight | null>(null);
  const rightHeadlightConeRef = useRef<THREE.SpotLight | null>(null);
  const leftDoorRef = useRef<THREE.Group | null>(null);
  const rightDoorRef = useRef<THREE.Group | null>(null);
  const spoilerMeshRef = useRef<THREE.Group | null>(null);

  const colors = [
    { name: 'Electric Cyber Cyan', hex: '#0284c7' },
    { name: 'Obsidian Midnight Black', hex: '#0c0d12' },
    { name: 'Hyper Neon Purple', hex: '#7c3aed' },
    { name: 'Apex Solar Red', hex: '#e11d48' },
    { name: 'Liquid Platinum Silver', hex: '#cbd5e1' },
    { name: 'Champagne Gold', hex: '#d97706' },
    { name: 'Acid Cyber Green', hex: '#10b981' },
  ];

  // Update material properties dynamically
  useEffect(() => {
    if (carPaintMatRef.current) {
      carPaintMatRef.current.color.set(paintColor);
      if (finish === 'metallic') {
        carPaintMatRef.current.metalness = 0.92;
        carPaintMatRef.current.roughness = 0.18;
        carPaintMatRef.current.clearcoat = 1.0;
        carPaintMatRef.current.clearcoatRoughness = 0.08;
      } else if (finish === 'matte') {
        carPaintMatRef.current.metalness = 0.15;
        carPaintMatRef.current.roughness = 0.85;
        carPaintMatRef.current.clearcoat = 0.0;
      } else {
        carPaintMatRef.current.metalness = 0.65;
        carPaintMatRef.current.roughness = 0.1;
        carPaintMatRef.current.clearcoat = 0.9;
        carPaintMatRef.current.clearcoatRoughness = 0.05;
      }
      carPaintMatRef.current.needsUpdate = true;
    }
  }, [paintColor, finish]);

  // Update neon light
  useEffect(() => {
    if (neonLightRef.current) {
      neonLightRef.current.intensity = neonActive ? 3.5 : 0;
      neonLightRef.current.color.set(paintColor);
    }
  }, [neonActive, paintColor]);

  // Update headlights
  useEffect(() => {
    if (leftHeadlightConeRef.current && rightHeadlightConeRef.current) {
      leftHeadlightConeRef.current.intensity = headlightsActive ? 6.0 : 0;
      rightHeadlightConeRef.current.intensity = headlightsActive ? 6.0 : 0;
    }
  }, [headlightsActive]);

  // Update spoiler visibility
  useEffect(() => {
    if (spoilerMeshRef.current) {
      spoilerMeshRef.current.visible = spoilerActive;
    }
  }, [spoilerActive]);

  // Update doors animation
  useEffect(() => {
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetZ = doorsOpen ? Math.PI / 4 : 0; // Butterfly doors angle
      const targetY = doorsOpen ? 0.35 : 0;
      leftDoorRef.current.rotation.z = targetZ;
      leftDoorRef.current.position.y = 0.45 + targetY;
      rightDoorRef.current.rotation.z = -targetZ;
      rightDoorRef.current.position.y = 0.45 + targetY;
    }
  }, [doorsOpen]);

  // Primary Three.js Car Model Construction
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const container = canvasRef.current;
    let width = container.clientWidth || 700;
    let height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.035);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.8, 2.0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting Array
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainKeyLight.position.set(6, 9, 6);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const softFillLight = new THREE.DirectionalLight(0x8ed5ff, 1.2);
    softFillLight.position.set(-6, 5, 4);
    scene.add(softFillLight);

    const rearRimLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    rearRimLight.position.set(0, 4, -7);
    scene.add(rearRimLight);

    // Floor and Shadow Catcher
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f1118,
      roughness: 0.25,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Circular Sci-Fi Showcase Stage Platform
    const stageGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.12, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x161822,
      roughness: 0.3,
      metalness: 0.7,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = 0.06;
    stage.receiveShadow = true;
    scene.add(stage);

    // Glowing stage perimeter ring
    const ringGeo = new THREE.RingGeometry(4.15, 4.25, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.121;
    scene.add(ring);

    // Concentric grid
    const grid = new THREE.GridHelper(30, 30, 0x38bdf8, 0x1d2025);
    grid.position.y = 0.005;
    scene.add(grid);

    // Car root group
    const carRoot = new THREE.Group();
    carRoot.position.y = 0.12;
    scene.add(carRoot);

    // Materials
    const carPaintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintColor),
      metalness: finish === 'metallic' ? 0.92 : finish === 'matte' ? 0.15 : 0.65,
      roughness: finish === 'metallic' ? 0.18 : finish === 'matte' ? 0.85 : 0.1,
      clearcoat: finish === 'metallic' ? 1.0 : finish === 'gloss' ? 0.9 : 0.0,
      clearcoatRoughness: 0.08,
    });
    carPaintMatRef.current = carPaintMat;

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.4,
      metalness: 0.3,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.7,
      thickness: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.95,
      roughness: 0.1,
    });

    // ----------------------------------------------------
    // BUILD SCULPTED SPORTS CAR BODY (AERODYNAMIC PROFILE)
    // ----------------------------------------------------
    // 1. Lower Main Monocoque Chassis
    const lowerBodyGeo = new THREE.BoxGeometry(3.6, 0.42, 1.68);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, carPaintMat);
    lowerBody.position.set(0, 0.32, 0);
    lowerBody.castShadow = true;
    carRoot.add(lowerBody);

    // 2. Front Nose Cone & Splitter
    const noseGeo = new THREE.BoxGeometry(0.85, 0.24, 1.62);
    const nose = new THREE.Mesh(noseGeo, carPaintMat);
    nose.position.set(1.9, 0.24, 0);
    nose.castShadow = true;
    carRoot.add(nose);

    // Carbon Front Splitter lip
    const splitterGeo = new THREE.BoxGeometry(0.95, 0.05, 1.76);
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(1.98, 0.13, 0);
    splitter.castShadow = true;
    carRoot.add(splitter);

    // Front Intake Mesh (Dark Black)
    const intakeGeo = new THREE.BoxGeometry(0.1, 0.18, 1.3);
    const intakeMat = new THREE.MeshBasicMaterial({ color: 0x030305 });
    const intake = new THREE.Mesh(intakeGeo, intakeMat);
    intake.position.set(2.33, 0.22, 0);
    carRoot.add(intake);

    // 3. Sloping Hood
    const hoodGeo = new THREE.BoxGeometry(1.4, 0.18, 1.5);
    const hood = new THREE.Mesh(hoodGeo, carPaintMat);
    hood.position.set(1.0, 0.52, 0);
    hood.rotation.z = -0.06;
    hood.castShadow = true;
    carRoot.add(hood);

    // 4. Cockpit / Curved Roof Greenhouse
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-0.25, 0.72, 0);
    carRoot.add(cabinGroup);

    // Roof Top
    const roofTopGeo = new THREE.BoxGeometry(1.65, 0.44, 1.32);
    const roofTop = new THREE.Mesh(roofTopGeo, carPaintMat);
    roofTop.castShadow = true;
    cabinGroup.add(roofTop);

    // Windshield (Front Slanted Glass)
    const windshieldGeo = new THREE.BoxGeometry(0.9, 0.42, 1.3);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0.8, -0.05, 0);
    windshield.rotation.z = -0.48;
    cabinGroup.add(windshield);

    // Rear Fastback Slanted Glass
    const rearGlassGeo = new THREE.BoxGeometry(0.95, 0.38, 1.28);
    const rearGlass = new THREE.Mesh(rearGlassGeo, glassMat);
    rearGlass.position.set(-0.82, -0.06, 0);
    rearGlass.rotation.z = 0.42;
    cabinGroup.add(rearGlass);

    // 5. Doors (Left & Right - Animateable)
    const doorGeo = new THREE.BoxGeometry(1.15, 0.48, 0.08);

    const leftDoor = new THREE.Group();
    leftDoor.position.set(-0.1, 0.45, 0.85);
    const leftDoorMesh = new THREE.Mesh(doorGeo, carPaintMat);
    leftDoorMesh.castShadow = true;
    leftDoor.add(leftDoorMesh);
    carRoot.add(leftDoor);
    leftDoorRef.current = leftDoor;

    const rightDoor = new THREE.Group();
    rightDoor.position.set(-0.1, 0.45, -0.85);
    const rightDoorMesh = new THREE.Mesh(doorGeo, carPaintMat);
    rightDoorMesh.castShadow = true;
    rightDoor.add(rightDoorMesh);
    carRoot.add(rightDoor);
    rightDoorRef.current = rightDoor;

    // 6. Side Mirrors
    const mirrorStemGeo = new THREE.BoxGeometry(0.06, 0.06, 0.2);
    const mirrorCapGeo = new THREE.BoxGeometry(0.18, 0.1, 0.12);

    const leftMirror = new THREE.Mesh(mirrorCapGeo, carbonMat);
    leftMirror.position.set(0.65, 0.68, 0.88);
    carRoot.add(leftMirror);

    const rightMirror = new THREE.Mesh(mirrorCapGeo, carbonMat);
    rightMirror.position.set(0.65, 0.68, -0.88);
    carRoot.add(rightMirror);

    // 7. Rear Diffuser & Exhaust Pipes
    const diffuserGeo = new THREE.BoxGeometry(0.6, 0.15, 1.6);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
    diffuser.position.set(-1.85, 0.22, 0);
    carRoot.add(diffuser);

    // Dual Exhaust tips
    const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16);
    exhaustGeo.rotateZ(Math.PI / 2);
    const leftExhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    leftExhaust.position.set(-2.05, 0.22, 0.35);
    const rightExhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    rightExhaust.position.set(-2.05, 0.22, -0.35);
    carRoot.add(leftExhaust);
    carRoot.add(rightExhaust);

    // 8. Cyberpunk LED Headlights & Projectors
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0x8ed5ff });
    const headlightGeo = new THREE.BoxGeometry(0.08, 0.08, 0.42);

    const leftLightMesh = new THREE.Mesh(headlightGeo, headlightMat);
    leftLightMesh.position.set(2.26, 0.34, 0.55);
    leftLightMesh.rotation.y = 0.2;
    carRoot.add(leftLightMesh);

    const rightLightMesh = new THREE.Mesh(headlightGeo, headlightMat);
    rightLightMesh.position.set(2.26, 0.34, -0.55);
    rightLightMesh.rotation.y = -0.2;
    carRoot.add(rightLightMesh);

    // Spotlights projecting forward
    const leftSpot = new THREE.SpotLight(0x8ed5ff, headlightsActive ? 6.0 : 0, 15, Math.PI / 7, 0.3, 1);
    leftSpot.position.set(2.3, 0.35, 0.55);
    const leftTarget = new THREE.Object3D();
    leftTarget.position.set(8, 0, 1.2);
    scene.add(leftTarget);
    leftSpot.target = leftTarget;
    carRoot.add(leftSpot);
    leftHeadlightConeRef.current = leftSpot;

    const rightSpot = new THREE.SpotLight(0x8ed5ff, headlightsActive ? 6.0 : 0, 15, Math.PI / 7, 0.3, 1);
    rightSpot.position.set(2.3, 0.35, -0.55);
    const rightTarget = new THREE.Object3D();
    rightTarget.position.set(8, 0, -1.2);
    scene.add(rightTarget);
    rightSpot.target = rightTarget;
    carRoot.add(rightSpot);
    rightHeadlightConeRef.current = rightSpot;

    // Full-Width Neon Cyber Taillight Bar
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
    const taillightGeo = new THREE.BoxGeometry(0.06, 0.08, 1.52);
    const taillight = new THREE.Mesh(taillightGeo, taillightMat);
    taillight.position.set(-1.82, 0.5, 0);
    carRoot.add(taillight);

    // 9. Carbon Fiber GT Spoiler with Pylons
    const spoilerGroup = new THREE.Group();
    spoilerGroup.position.set(-1.65, 0.85, 0);

    const wingGeo = new THREE.BoxGeometry(0.32, 0.05, 1.72);
    const wingMesh = new THREE.Mesh(wingGeo, carbonMat);
    spoilerGroup.add(wingMesh);

    // Pylons
    const pylonGeo = new THREE.BoxGeometry(0.12, 0.28, 0.04);
    const leftPylon = new THREE.Mesh(pylonGeo, carbonMat);
    leftPylon.position.set(0, -0.14, 0.45);
    spoilerGroup.add(leftPylon);
    const rightPylon = new THREE.Mesh(pylonGeo, carbonMat);
    rightPylon.position.set(0, -0.14, -0.45);
    spoilerGroup.add(rightPylon);

    spoilerGroup.visible = spoilerActive;
    carRoot.add(spoilerGroup);
    spoilerMeshRef.current = spoilerGroup;

    // 10. Wheels (Realistic Tire + Rim + Brake Disc & Caliper)
    const wheelPositions = [
      [1.25, 0.34, 0.88, true], // Front-Left
      [1.25, 0.34, -0.88, false], // Front-Right
      [-1.25, 0.34, 0.88, true], // Rear-Left
      [-1.25, 0.34, -0.88, false], // Rear-Right
    ];

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1d,
      roughness: 0.85,
      metalness: 0.1,
    });

    const brakeRotorMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.9,
      roughness: 0.2,
    });

    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48, // Brembo Red
      metalness: 0.8,
      roughness: 0.2,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: wheelType === 'aero' ? 0x1f2937 : 0xe2e8f0,
      metalness: wheelType === 'forged' ? 0.95 : 0.7,
      roughness: 0.15,
    });

    wheelPositions.forEach(([x, y, z, isLeft]) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(x as number, y as number, z as number);

      // Rubber Tire
      const tireGeo = new THREE.TorusGeometry(0.34, 0.12, 16, 32);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.castShadow = true;
      wheelAssembly.add(tire);

      // Alloy Rim Cylinder
      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.18, 24);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      wheelAssembly.add(rim);

      // 5 Twin-Spoke Geometry
      for (let s = 0; s < 5; s++) {
        const spokeGeo = new THREE.BoxGeometry(0.04, 0.24, 0.08);
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        spoke.rotation.z = (s / 5) * Math.PI * 2;
        wheelAssembly.add(spoke);
      }

      // Brake Rotor Disc
      const rotorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.03, 24);
      rotorGeo.rotateX(Math.PI / 2);
      const rotor = new THREE.Mesh(rotorGeo, brakeRotorMat);
      wheelAssembly.add(rotor);

      // Red Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.08, 0.12, 0.08);
      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(0.08, 0.1, 0);
      wheelAssembly.add(caliper);

      carRoot.add(wheelAssembly);
    });

    // 11. Cyber Underglow Neon
    const neonLight = new THREE.PointLight(new THREE.Color(paintColor), neonActive ? 3.5 : 0, 5, 2);
    neonLight.position.set(0, 0.15, 0);
    carRoot.add(neonLight);
    neonLightRef.current = neonLight;

    // ----------------------------------------------------
    // INTERACTIVE ORBIT & PAN & ZOOM
    // ----------------------------------------------------
    let isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };
    let spherical = {
      radius: 7.2,
      theta: 0.8,
      phi: 1.25,
    };

    const updateCameraPos = () => {
      spherical.radius = Math.max(3.5, Math.min(12, spherical.radius));
      spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.phi)); // don't go under floor

      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0.45, 0);
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi -= deltaY * 0.008;
      updateCameraPos();

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius += e.deltaY * 0.005;
      updateCameraPos();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile devices
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isMouseDown = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isMouseDown) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        spherical.theta -= deltaX * 0.008;
        spherical.phi -= deltaY * 0.008;
        updateCameraPos();
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchStartDist - dist;
        spherical.radius += diff * 0.01;
        updateCameraPos();
        touchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      isMouseDown = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 700;
      height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    updateCameraPos();

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !isMouseDown) {
        spherical.theta += 0.004;
        updateCameraPos();
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, wheelType]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#151821] border border-white/10 shadow-2xl flex flex-col">
        {/* Top Header with PROMINENT BACK BUTTON ("Qaytish") */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#191c26]/90 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Prominent Back Button */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#282a36] hover:bg-[#38bdf8] text-[#e2e2ea] hover:text-[#00354a] font-['Space_Grotesk'] text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer shadow-md group"
              title="Portfolioga qaytish"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              <span>{currentLang === 'uz' ? 'Orqaga qaytish' : 'Back to Portfolio'}</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-white/10" />

            <div className="hidden md:flex flex-col">
              <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#e2e2ea] flex items-center gap-2">
                KHUSANOV LUXURY CAR CONFIGURATOR
                <span className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
                  PBR 3D
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-['JetBrains_Mono'] text-xs border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              60 FPS WebGL 2.0
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#282a36] hover:bg-rose-500/20 text-[#bdc8d1] hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer border border-white/5"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* 3D Viewport Column */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div
              ref={canvasRef}
              className="w-full h-[340px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#0a0c10] border border-white/10 cursor-grab active:cursor-grabbing relative shadow-inner"
            >
              {/* Viewport Floating Overlays */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-md bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[11px] text-[#38bdf8] border border-white/10">
                  ↺ 360° Sichqoncha bilan aylantiring
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[11px] text-[#bdc8d1] border border-white/10">
                  Qidiruv: Zoom (G'ildirak)
                </span>
              </div>

              {/* Auto rotate toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#191c26]/90 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#bdc8d1] hover:text-[#38bdf8] border border-white/10 transition-colors pointer-events-auto cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {autoRotate ? 'pause' : 'play_arrow'}
                </span>
                <span>{autoRotate ? 'Aylanishni to\'xtatish' : 'Avto-aylanish'}</span>
              </button>

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[11px] text-[#c5c9ff] border border-white/10 pointer-events-none">
                Clearcoat Raytracing Active
              </div>
            </div>

            {/* Performance specs panel */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-[#111319] border border-white/5 font-['JetBrains_Mono'] text-xs">
              <div>
                <span className="text-[#87929a] block text-[10px]">0-100 KM/H</span>
                <span className="text-[#38bdf8] font-bold text-sm">2.8s</span>
              </div>
              <div>
                <span className="text-[#87929a] block text-[10px]">OT KUCHI</span>
                <span className="text-[#ddb7ff] font-bold text-sm">740 HP</span>
              </div>
              <div>
                <span className="text-[#87929a] block text-[10px]">MAKS TEZLIK</span>
                <span className="text-[#c5c9ff] font-bold text-sm">340 km/h</span>
              </div>
              <div>
                <span className="text-[#87929a] block text-[10px]">AERO BOSIM</span>
                <span className="text-emerald-400 font-bold text-sm">+380 kg</span>
              </div>
            </div>
          </div>

          {/* Configuration Tooling Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Color Palette */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase font-semibold">
                  1. Korpus rangi (Body Paint)
                </label>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#bdc8d1]">
                  {colors.find((c) => c.hex === paintColor)?.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setPaintColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer shadow-md ${
                      paintColor === c.hex
                        ? 'scale-125 border-[#38bdf8] ring-2 ring-[#38bdf8]/40 shadow-[0_0_12px_#38bdf8]'
                        : 'border-white/20 hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Finish Selection */}
            <div>
              <label className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block mb-2 font-semibold">
                2. Qoplama turi (Surface Finish)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['metallic', 'matte', 'gloss'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`py-2 px-3 rounded-lg font-['JetBrains_Mono'] text-xs capitalize transition-colors cursor-pointer border ${
                      finish === f
                        ? 'bg-[#38bdf8] text-[#00354a] font-bold border-[#38bdf8]'
                        : 'bg-[#191c26] text-[#bdc8d1] border-white/5 hover:text-white'
                    }`}
                  >
                    {f === 'metallic' ? 'Metallik' : f === 'matte' ? 'Matoviy' : 'Yaltiroq'}
                  </button>
                ))}
              </div>
            </div>

            {/* Wheel Packages */}
            <div>
              <label className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block mb-2 font-semibold">
                3. Diskalar to'plami (Forged Rims)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'forged', label: 'Forged GT 20"' },
                  { id: 'aero', label: 'Carbon Aero 21"' },
                  { id: 'gt', label: 'Race Mesh 20"' },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWheelType(w.id as any)}
                    className={`py-2 px-2 text-center rounded-lg font-['JetBrains_Mono'] text-xs transition-colors cursor-pointer border ${
                      wheelType === w.id
                        ? 'bg-[#c5c9ff] text-[#131e8c] font-bold border-[#c5c9ff]'
                        : 'bg-[#191c26] text-[#bdc8d1] border-white/5 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Controls Toggles */}
            <div className="flex flex-col gap-2 pt-1 font-['Geist'] text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#111319] border border-white/5 cursor-pointer hover:border-white/10">
                <span className="text-[#e2e2ea] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">sensor_door</span>
                  Eshiklarni ochish (Butterfly Doors)
                </span>
                <input
                  type="checkbox"
                  checked={doorsOpen}
                  onChange={(e) => setDoorsOpen(e.target.checked)}
                  className="w-4 h-4 accent-[#38bdf8] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#111319] border border-white/5 cursor-pointer hover:border-white/10">
                <span className="text-[#e2e2ea] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-400">light_mode</span>
                  Fara yoritgichi (Xenon LED Spotlights)
                </span>
                <input
                  type="checkbox"
                  checked={headlightsActive}
                  onChange={(e) => setHeadlightsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#38bdf8] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#111319] border border-white/5 cursor-pointer hover:border-white/10">
                <span className="text-[#e2e2ea] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ddb7ff]">speed</span>
                  Karbon orqa qanot (Active GT Wing)
                </span>
                <input
                  type="checkbox"
                  checked={spoilerActive}
                  onChange={(e) => setSpoilerActive(e.target.checked)}
                  className="w-4 h-4 accent-[#38bdf8] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#111319] border border-white/5 cursor-pointer hover:border-white/10">
                <span className="text-[#e2e2ea] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">fluorescent</span>
                  Cyber Neon nuri (Underglow Lighting)
                </span>
                <input
                  type="checkbox"
                  checked={neonActive}
                  onChange={(e) => setNeonActive(e.target.checked)}
                  className="w-4 h-4 accent-[#38bdf8] cursor-pointer"
                />
              </label>
            </div>

            {/* Bottom Actions with Return button & Save */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-[#282a36] hover:bg-[#333544] text-[#e2e2ea] font-['Space_Grotesk'] text-sm font-semibold transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>{currentLang === 'uz' ? 'Qaytish' : 'Back'}</span>
                </button>

                <button
                  onClick={() => {
                    setSavedToast(true);
                    setTimeout(() => setSavedToast(false), 3000);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#7bd0ff] text-[#00354a] font-['Space_Grotesk'] text-sm font-bold shadow-lg hover:shadow-[#38bdf8]/40 hover:scale-[1.02] transition-transform cursor-pointer text-center"
                >
                  Konfiguratsiyani saqlash
                </button>
              </div>

              {savedToast && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs text-center font-['JetBrains_Mono'] border border-emerald-500/30 animate-in fade-in">
                  ✓ Avtomobil konfiguratsiyasi muvaffaqiyatli saqlandi!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. CYBERPUNK METAVERSE 2025 // ADVANCED 3D CYBER CITY SHOWROOM
// ============================================================================
interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: 'uz' | 'en';
}

export function CyberModal({ isOpen, onClose, currentLang = 'uz' }: CyberModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'free' | 'drone' | 'iso'>('free');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070d);
    scene.fog = new THREE.FogExp2(0x05070d, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    camera.position.set(0, 4, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Neon ambient lights
    const ambientLight = new THREE.AmbientLight(0x0a1026, 1.2);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x0284c7, 4.0, 35);
    cyanPoint.position.set(0, 6, 0);
    scene.add(cyanPoint);

    const purplePoint = new THREE.PointLight(0xa855f7, 4.5, 40);
    purplePoint.position.set(-8, 8, -5);
    scene.add(purplePoint);

    const magentaSpot = new THREE.SpotLight(0xf43f5e, 5.0, 45, Math.PI / 4, 0.5);
    magentaSpot.position.set(10, 15, 8);
    scene.add(magentaSpot);

    // Wet Reflective Neon Grid Ground
    const gridGroundGeo = new THREE.PlaneGeometry(80, 80);
    const gridGroundMat = new THREE.MeshStandardMaterial({
      color: 0x080b12,
      roughness: 0.15,
      metalness: 0.85,
    });
    const gridGround = new THREE.Mesh(gridGroundGeo, gridGroundMat);
    gridGround.rotation.x = -Math.PI / 2;
    gridGround.position.y = -0.01;
    scene.add(gridGround);

    const cyberGrid = new THREE.GridHelper(80, 60, 0x38bdf8, 0x9333ea);
    cyberGrid.position.y = 0.01;
    scene.add(cyberGrid);

    // Holographic Cyber Spire / Central Floating Vehicle
    const centralGroup = new THREE.Group();
    centralGroup.position.set(0, 2.2, 0);
    scene.add(centralGroup);

    // Futuristic Aerodynamic Cyber Craft
    const craftBodyGeo = new THREE.ConeGeometry(0.9, 3.2, 5);
    craftBodyGeo.rotateX(Math.PI / 2);
    const craftMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.95,
      roughness: 0.1,
    });
    const craftBody = new THREE.Mesh(craftBodyGeo, craftMat);
    centralGroup.add(craftBody);

    // Neon Cockpit Glow
    const cockpitGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const cockpitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.25, 0.4);
    centralGroup.add(cockpit);

    // Dual Plasma Thruster Rings
    const thrusterGeo = new THREE.TorusGeometry(0.55, 0.06, 16, 32);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const leftThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    leftThruster.position.set(1.1, 0, -0.6);
    centralGroup.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    rightThruster.position.set(-1.1, 0, -0.6);
    centralGroup.add(rightThruster);

    // Surrounding Cyber City Skyscrapers
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const buildingCount = 28;
    for (let i = 0; i < buildingCount; i++) {
      const bHeight = 4 + Math.random() * 9;
      const bWidth = 1.4 + Math.random() * 1.6;
      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bWidth);

      // Procedural window lines
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.4,
        metalness: 0.6,
      });

      const building = new THREE.Mesh(bGeo, bMat);
      const angle = (i / buildingCount) * Math.PI * 2;
      const dist = 9 + Math.random() * 16;
      building.position.set(Math.cos(angle) * dist, bHeight / 2, Math.sin(angle) * dist);
      cityGroup.add(building);

      // Glowing Neon Roof Beacon / Aerial Antenna
      const antennaGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
      const antennaMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x38bdf8 : 0xf43f5e,
      });
      const antenna = new THREE.Mesh(antennaGeo, antennaMat);
      antenna.position.set(0, bHeight / 2 + 0.9, 0);
      building.add(antenna);

      // Glowing Neon Ribbon Edges on selective buildings
      if (i % 3 === 0) {
        const edgeWireGeo = new THREE.EdgesGeometry(bGeo);
        const edgeWireMat = new THREE.LineBasicMaterial({
          color: i % 2 === 0 ? 0x0284c7 : 0xa855f7,
        });
        const edgeWire = new THREE.LineSegments(edgeWireGeo, edgeWireMat);
        building.add(edgeWire);
      }
    }

    // Moving Cyber Traffic / Light Streams
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let p = 0; p < particleCount; p++) {
      particlePos[p * 3] = (Math.random() - 0.5) * 50;
      particlePos[p * 3 + 1] = Math.random() * 8 + 0.5;
      particlePos[p * 3 + 2] = (Math.random() - 0.5) * 50;
      particleSpeeds.push(0.05 + Math.random() * 0.12);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Drag Rotation
    let isMouseDown = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = { theta: 0, phi: 1.3, radius: 14 };

    const updateCam = () => {
      camera.position.x = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.position.y = cameraAngle.radius * Math.cos(cameraAngle.phi);
      camera.position.z = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.lookAt(0, 1.8, 0);
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      cameraAngle.theta -= dx * 0.008;
      cameraAngle.phi = Math.max(0.3, Math.min(Math.PI / 2 - 0.05, cameraAngle.phi - dy * 0.008));
      updateCam();
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAngle.radius = Math.max(5, Math.min(25, cameraAngle.radius + e.deltaY * 0.01));
      updateCam();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Float craft smoothly
      centralGroup.position.y = 2.2 + Math.sin(elapsed * 1.5) * 0.25;
      centralGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.15;
      leftThruster.rotation.x = elapsed * 2;
      rightThruster.rotation.x = elapsed * 2;

      // Camera modes
      if (viewMode === 'drone') {
        camera.position.x = Math.sin(elapsed * 0.4) * 16;
        camera.position.z = Math.cos(elapsed * 0.4) * 16;
        camera.position.y = 7 + Math.sin(elapsed * 0.6) * 2;
        camera.lookAt(0, 1.5, 0);
      } else if (viewMode === 'iso') {
        camera.position.set(14, 12, 14);
        camera.lookAt(0, 0.5, 0);
      } else if (!isMouseDown) {
        cameraAngle.theta += 0.003;
        updateCam();
      }

      // Move light stream particles
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let p = 0; p < particleCount; p++) {
        posArr[p * 3 + 2] += particleSpeeds[p];
        if (posArr[p * 3 + 2] > 25) {
          posArr[p * 3 + 2] = -25;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, viewMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#151821] border border-white/10 shadow-2xl flex flex-col">
        {/* Top Header with PROMINENT BACK BUTTON */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#191c26]/90 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Prominent Back Button */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#282a36] hover:bg-[#38bdf8] text-[#e2e2ea] hover:text-[#00354a] font-['Space_Grotesk'] text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer shadow-md group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              <span>{currentLang === 'uz' ? 'Orqaga qaytish' : 'Back to Portfolio'}</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-white/10" />

            <div className="hidden md:flex flex-col">
              <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#e2e2ea] flex items-center gap-2">
                CYBERPUNK METAVERSE 2025
                <span className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#a855f7]/20 text-[#ddb7ff] border border-[#a855f7]/30">
                  WEBGL GLSL
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] font-['JetBrains_Mono'] text-xs border border-[#38bdf8]/20">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              Realtime Shader Matrix
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#282a36] hover:bg-rose-500/20 text-[#bdc8d1] hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer border border-white/5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Viewport & Controls */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <div
            ref={containerRef}
            className="w-full h-[400px] sm:h-[500px] rounded-2xl bg-[#05070d] overflow-hidden border border-white/10 relative shadow-inner cursor-grab active:cursor-grabbing"
          >
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#38bdf8] border border-white/10 pointer-events-none flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              <span>Holographic Spatial Stage</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#111319] border border-white/5">
            {/* Camera Switcher */}
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1] mr-1">Kamera rejimi:</span>
              <button
                onClick={() => setViewMode('free')}
                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs cursor-pointer border transition-colors ${
                  viewMode === 'free'
                    ? 'bg-[#38bdf8] text-[#00354a] font-bold border-[#38bdf8]'
                    : 'bg-[#282a36] text-[#bdc8d1] border-white/5 hover:text-white'
                }`}
              >
                Erkin Orbit (360°)
              </button>
              <button
                onClick={() => setViewMode('drone')}
                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs cursor-pointer border transition-colors ${
                  viewMode === 'drone'
                    ? 'bg-[#38bdf8] text-[#00354a] font-bold border-[#38bdf8]'
                    : 'bg-[#282a36] text-[#bdc8d1] border-white/5 hover:text-white'
                }`}
              >
                Dron Parvozi
              </button>
              <button
                onClick={() => setViewMode('iso')}
                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs cursor-pointer border transition-colors ${
                  viewMode === 'iso'
                    ? 'bg-[#38bdf8] text-[#00354a] font-bold border-[#38bdf8]'
                    : 'bg-[#282a36] text-[#bdc8d1] border-white/5 hover:text-white'
                }`}
              >
                Izometrik 3D
              </button>
            </div>

            {/* Bottom Return Button */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#282a36] hover:bg-[#333544] text-[#e2e2ea] font-['Space_Grotesk'] text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>{currentLang === 'uz' ? 'Portfolioga qaytish' : 'Return to Portfolio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. NEURAL FINTECH DASHBOARD // 3D POINT-CLOUD & FINANCIAL NETWORK
// ============================================================================
interface FintechModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: 'uz' | 'en';
}

export function FintechModal({ isOpen, onClose, currentLang = 'uz' }: FintechModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeAsset, setActiveAsset] = useState<string>('BTC/USD');
  const [nodesCount, setNodesCount] = useState(142800);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Central Algorithmic Orb Core
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: false,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 3D Neural Nodes Galaxy
    const nodesTotal = 800;
    const pointsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodesTotal * 3);
    const colors = new Float32Array(nodesTotal * 3);

    const color1 = new THREE.Color(0x38bdf8); // Cyan
    const color2 = new THREE.Color(0xa855f7); // Purple
    const color3 = new THREE.Color(0x10b981); // Emerald profit

    for (let i = 0; i < nodesTotal; i++) {
      const radius = 3.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mixedColor = i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const pointCloud = new THREE.Points(pointsGeo, pointsMat);
    scene.add(pointCloud);

    // Dynamic Connections Lines
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    const linesGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    for (let l = 0; l < 90; l++) {
      const idxA = Math.floor(Math.random() * nodesTotal);
      const idxB = Math.floor(Math.random() * nodesTotal);
      linePositions.push(
        positions[idxA * 3],
        positions[idxA * 3 + 1],
        positions[idxA * 3 + 2],
        positions[idxB * 3],
        positions[idxB * 3 + 1],
        positions[idxB * 3 + 2]
      );
    }
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(lines);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      coreMesh.rotation.y = elapsed * 0.3 + mouseX * 0.6;
      coreMesh.rotation.x = elapsed * 0.2 - mouseY * 0.4;

      innerMesh.rotation.y = -elapsed * 0.4;
      pointCloud.rotation.y = elapsed * 0.15;
      lines.rotation.y = elapsed * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#151821] border border-white/10 shadow-2xl flex flex-col">
        {/* Top Header with PROMINENT BACK BUTTON */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#191c26]/90 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Prominent Back Button */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#282a36] hover:bg-[#38bdf8] text-[#e2e2ea] hover:text-[#00354a] font-['Space_Grotesk'] text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer shadow-md group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              <span>{currentLang === 'uz' ? 'Orqaga qaytish' : 'Back to Portfolio'}</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-white/10" />

            <div className="hidden md:flex flex-col">
              <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#e2e2ea] flex items-center gap-2">
                NEURAL FINTECH DASHBOARD
                <span className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#c5c9ff]/20 text-[#c5c9ff] border border-[#c5c9ff]/30">
                  REAL-TIME 3D
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-['JetBrains_Mono'] text-xs border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Latency: 11ms (Sub-14ms SLA)
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#282a36] hover:bg-rose-500/20 text-[#bdc8d1] hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer border border-white/5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 3D Canvas & Financial Telemetry */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <div
            ref={containerRef}
            className="w-full h-[380px] sm:h-[460px] rounded-2xl bg-[#06080e] overflow-hidden border border-white/10 relative shadow-inner"
          >
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#38bdf8] border border-white/10 pointer-events-none">
              3D Algorithmic Node Topology
            </div>

            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#111319]/80 backdrop-blur-md font-['JetBrains_Mono'] text-xs text-[#c5c9ff] border border-white/10 pointer-events-none">
              Nodes: {nodesCount.toLocaleString()} active
            </div>
          </div>

          {/* Real-time Order Book Simulation & Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { pair: 'BTC / USD', price: '$89,450.20', change: '+4.2%', speed: '12,400 tx/s' },
              { pair: 'ETH / USD', price: '$3,240.50', change: '+2.8%', speed: '8,900 tx/s' },
              { pair: 'SOL / USD', price: '$188.75', change: '+6.1%', speed: '45,000 tx/s' },
              { pair: 'GPU COMPUTE', price: '0.002ms', change: 'GLSL SHADER', speed: '60.0 FPS' },
            ].map((t) => (
              <div
                key={t.pair}
                onClick={() => setActiveAsset(t.pair)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeAsset === t.pair
                    ? 'bg-[#282a36] border-[#38bdf8] shadow-md'
                    : 'bg-[#191c26] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#87929a]">{t.pair}</span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-emerald-400">{t.change}</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#e2e2ea] block mt-1">
                  {t.price}
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#bdc8d1] block mt-0.5">
                  {t.speed}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Bar with Return */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setNodesCount((prev) => prev + 10000)}
              className="px-4 py-2 rounded-xl bg-[#282a36] hover:bg-[#333544] text-xs font-['JetBrains_Mono'] text-[#38bdf8] border border-white/10 transition-colors cursor-pointer"
            >
              +10,000 Tugun qo'shish
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#38bdf8] hover:bg-[#7bd0ff] text-[#00354a] font-['Space_Grotesk'] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>{currentLang === 'uz' ? 'Portfolioga qaytish' : 'Return to Portfolio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. TECHNICAL DOCUMENTATION DRAWER MODAL
// ============================================================================
interface TechDocsModalProps {
  isOpen: boolean;
  projectName: string | null;
  onClose: () => void;
  currentLang?: 'uz' | 'en';
}

export function TechDocsModal({ isOpen, projectName, onClose, currentLang = 'uz' }: TechDocsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !projectName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#151821] border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#282a36] hover:bg-[#38bdf8] text-[#e2e2ea] hover:text-[#00354a] font-['Space_Grotesk'] text-xs font-semibold transition-all border border-white/10 cursor-pointer shadow-sm group"
            >
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              <span>{currentLang === 'uz' ? 'Orqaga' : 'Back'}</span>
            </button>
            <div>
              <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block">
                // ARCHITECTURE & TECHNICAL SPECIFICATION
              </span>
              <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#e2e2ea]">
                {projectName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#282a36] text-[#bdc8d1] hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 font-['Geist'] text-xs sm:text-sm text-[#bdc8d1] max-h-[60vh] overflow-y-auto pr-2">
          <div className="p-4 rounded-xl bg-[#111319] border border-white/5 flex flex-col gap-2">
            <h4 className="font-['Space_Grotesk'] font-bold text-[#e2e2ea] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">memory</span>
              Rendering & Shading texnologiyasi:
            </h4>
            <p className="leading-relaxed">
              Ushbu loyihada WebGL 2.0 va Three.js R160+ asosida custom GLSL vertex hamda fragment shaderlari yozilgan. Ob'ektlar DRACO geometriyalari bilan 85% gacha siqilgan bo'lib, mobil internetda ham 1 soniyadan kam vaqtda to'liq yuklanadi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111319] border border-white/5 flex flex-col gap-2 font-['JetBrains_Mono'] text-xs">
            <span className="text-[#38bdf8] font-bold">// GLSL Vertex Transform Matrix Snippet:</span>
            <pre className="text-[#bdc8d1] overflow-x-auto p-3 bg-[#0a0c10] rounded-lg border border-white/5 leading-relaxed">
{`uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normal;
  vec3 pos = position;
  pos.y += sin(pos.x * 2.0 + uTime * 1.5) * 0.12;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-['JetBrains_Mono']">
            <div className="p-3 rounded-lg bg-[#282a36] border border-white/5">
              <span className="text-[#87929a] block">FPS STABILITY</span>
              <span className="text-[#38bdf8] font-bold text-sm">60.0 FPS Locked</span>
            </div>
            <div className="p-3 rounded-lg bg-[#282a36] border border-white/5">
              <span className="text-[#87929a] block">DRACO COMPRESSION</span>
              <span className="text-[#ddb7ff] font-bold text-sm">14.2MB → 1.8MB</span>
            </div>
          </div>
        </div>

        {/* Footer Return Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#282a36] hover:bg-[#38bdf8] text-[#e2e2ea] hover:text-[#00354a] font-['Space_Grotesk'] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{currentLang === 'uz' ? 'Portfolioga qaytish' : 'Return to Portfolio'}</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 5. CONSULTATION / PROJECT BRIEF MODAL
// ============================================================================
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#151821] border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#282a36] hover:bg-[#38bdf8] text-[#e2e2ea] hover:text-[#00354a] font-['Space_Grotesk'] text-xs font-semibold transition-all border border-white/10 cursor-pointer shadow-sm group"
            >
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              <span>{currentLang === 'uz' ? 'Orqaga' : 'Back'}</span>
            </button>
            <div>
              <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase block">
                // LOYIHANI BOSHLASH
              </span>
              <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#e2e2ea]">
                {currentLang === 'uz' ? "Konsultatsiya & Loyiha Anketasi" : "Project Consultation Brief"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#282a36] text-[#bdc8d1] hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2ea]">
              Murojaatingiz qabul qilindi!
            </h4>
            <p className="font-['Geist'] text-xs text-[#bdc8d1] max-w-xs leading-relaxed">
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0c10] border border-white/10 text-[#e2e2ea] placeholder-[#87929a] focus:outline-none focus:border-[#38bdf8]"
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0c10] border border-white/10 text-[#e2e2ea] placeholder-[#87929a] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#bdc8d1] mb-1 font-['JetBrains_Mono']">Loyiha turi:</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0a0c10] border border-white/10 text-[#e2e2ea] focus:outline-none focus:border-[#38bdf8]"
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
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0a0c10] border border-white/10 text-[#e2e2ea] focus:outline-none focus:border-[#38bdf8]"
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0c10] border border-white/10 text-[#e2e2ea] placeholder-[#87929a] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#7bd0ff] text-[#00354a] font-['Space_Grotesk'] text-sm font-bold shadow-lg hover:shadow-[#38bdf8]/40 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Yuborish & Bepul Konsultatsiya olish
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-[#bdc8d1] font-['Space_Grotesk'] text-xs font-semibold transition-colors text-center"
              >
                Bekor qilish va portfolioga qaytish
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
