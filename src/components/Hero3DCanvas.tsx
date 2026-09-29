import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  onFpsUpdate?: (fps: number) => void;
}

export default function Hero3DCanvas({ onFpsUpdate }: Hero3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 680;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 3.5, 25);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 4.0, 25);
    pointLight2.position.set(-5, -4, 4);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
    dirLight.position.set(0, 8, 4);
    scene.add(dirLight);

    // Central Interactive Tech / Creative Core Object
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Central Icosahedron Crystal
    const icoGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const icoMat = new THREE.MeshPhongMaterial({
      color: 0x1e1b4b,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.38,
      specular: 0x67e8f9,
      shininess: 90,
      flatShading: true,
      wireframe: false,
    });
    const crystal = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(crystal);

    // Wireframe cage over crystal
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const crystalWire = new THREE.Mesh(icoGeo, wireMat);
    crystalWire.scale.setScalar(1.08);
    coreGroup.add(crystalWire);

    // Orbital Ring 1 (Tilted cyan tech gyro ring)
    const ringGeo1 = new THREE.TorusGeometry(2.6, 0.035, 16, 100);
    const ringMat1 = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      shininess: 100,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    // Orbital Ring 2 (Purple neon gyro ring)
    const ringGeo2 = new THREE.TorusGeometry(3.1, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshPhongMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.75,
      shininess: 100,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    coreGroup.add(ring2);

    // Floating cubes
    const cubesCount = 28;
    const cubesGroup = new THREE.Group();
    const cubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const cubeMat = new THREE.MeshPhongMaterial({
      color: 0xc084fc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.45,
      shininess: 80,
    });

    const cubeData: {
      mesh: THREE.Mesh;
      speedX: number;
      speedY: number;
      orbitSpeed: number;
      orbitRadius: number;
      angle: number;
      y: number;
    }[] = [];

    for (let i = 0; i < cubesCount; i++) {
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      const radius = 3.5 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      cube.position.set(
        radius * Math.cos(theta) * Math.cos(phi),
        radius * Math.sin(phi),
        radius * Math.sin(theta) * Math.cos(phi)
      );
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      cubesGroup.add(cube);
      cubeData.push({
        mesh: cube,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        orbitSpeed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        orbitRadius: radius,
        angle: theta,
        y: cube.position.y,
      });
    }
    scene.add(cubesGroup);

    // Particle galaxy
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 30;
      particlePos[i + 1] = (Math.random() - 0.5) * 25;
      particlePos[i + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragRotationX = 0;
    let dragRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = (clientX / (rect.width || window.innerWidth) - 0.5) * 2;
      mouseY = (clientY / (rect.height || window.innerHeight) - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        dragRotationY += deltaX * 0.008;
        dragRotationX += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 680;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    // Animation & FPS tracking loop
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let framesCount = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      coreGroup.rotation.y = elapsed * 0.35 + targetX * 0.8 + dragRotationY;
      coreGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.15 - targetY * 0.6 + dragRotationX;
      coreGroup.position.y = Math.sin(elapsed * 1.2) * 0.18;

      crystalWire.rotation.y = -elapsed * 0.2;
      crystalWire.rotation.z = elapsed * 0.15;

      ring1.rotation.z = elapsed * 0.5;
      ring2.rotation.y = -elapsed * 0.45;

      // Orbit cubes
      for (let i = 0; i < cubeData.length; i++) {
        const d = cubeData[i];
        d.angle += d.orbitSpeed;
        d.mesh.position.x = Math.cos(d.angle) * d.orbitRadius;
        d.mesh.position.z = Math.sin(d.angle) * d.orbitRadius;
        d.mesh.position.y = d.y + Math.sin(elapsed * 1.5 + i) * 0.25;
        d.mesh.rotation.x += d.speedX;
        d.mesh.rotation.y += d.speedY;
      }

      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.015;

      renderer.render(scene, camera);

      // FPS calculation
      framesCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        const calculatedFps = Math.round((framesCount * 1000) / (now - lastFpsTime));
        if (onFpsUpdate) onFpsUpdate(Math.min(calculatedFps, 60));
        framesCount = 0;
        lastFpsTime = now;
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);

      // Clean up Three.js objects
      icoGeo.dispose();
      icoMat.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      cubeGeo.dispose();
      cubeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onFpsUpdate]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-[680px] pointer-events-auto bg-transparent z-0 cursor-grab active:cursor-grabbing"
      title="Sichqoncha bilan 3D shaklni aylantirishingiz mumkin"
    />
  );
}
