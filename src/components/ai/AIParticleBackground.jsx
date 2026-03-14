"use client";
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function AIParticleBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);

    // الكاميرا
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // الرندر
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // إنشاء النجوم/النقاط
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // المواقع العشوائية
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 100;

      // الألوان: أزرق/بنفسجي/ذهبي
      const color = new THREE.Color();
      if (Math.random() > 0.7) {
        color.setHSL(0.6, 0.8, 0.6); // أزرق
      } else if (Math.random() > 0.4) {
        color.setHSL(0.8, 0.9, 0.7); // بنفسجي
      } else {
        color.setHSL(0.1, 0.9, 0.6); // ذهبي
      }

      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // إنشاء خطوط بين النقاط القريبة
    const linesGeometry = new THREE.BufferGeometry();
    const linesPositions = [];

    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dx = posArray[i*3] - posArray[j*3];
        const dy = posArray[i*3+1] - posArray[j*3+1];
        const dz = posArray[i*3+2] - posArray[j*3+2];
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (distance < 15) {
          linesPositions.push(posArray[i*3], posArray[i*3+1], posArray[i*3+2]);
          linesPositions.push(posArray[j*3], posArray[j*3+1], posArray[j*3+2]);
        }
      }
    }

    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linesPositions, 3));

    // المواد
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x3366ff,
      transparent: true,
      opacity: 0.15
    });

    // إنشاء الكائنات
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);

    scene.add(particlesMesh);
    scene.add(linesMesh);

    // التحريك
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // الرسوم المتحركة
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.0002;
      linesMesh.rotation.y += 0.0002;

      particlesMesh.rotation.x += mouseY * 0.0005;
      linesMesh.rotation.x += mouseY * 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // التكيف مع تغيير حجم النافذة
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', () => {});
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
                                                                      }
