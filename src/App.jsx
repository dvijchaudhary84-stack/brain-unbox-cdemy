import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import NatureScene from './components/NatureScene';
import ContentOverlay from './components/ContentOverlay';

export default function App() {
  useEffect(() => {
    // Hidden on touch screen devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      document.body.style.cursor = 'auto';
      const styles = document.createElement('style');
      styles.innerHTML = '* { cursor: auto !important; }';
      document.head.appendChild(styles);
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initial 3D camera target state
    window.__natureTarget = { x: 0, y: 0, z: 5, rx: 0, ry: 0 };

    // GSAP scroll coordinates mapping logic
    const handleScroll = ({ scroll, limit }) => {
      const progress = scroll / limit || 0;

      // Define camera positions for choreography
      // 0.0 (Hero): camera straight ahead at (0, 0, 5)
      // 0.35 (Courses): zoom in and slide slightly to the right
      // 0.70 (Syllabus): rotate to side angle and pan down
      // 1.0 (Enroll): close-up on the nest, showing the glowing eggs clearly
      
      const targetX = Math.sin(progress * Math.PI) * 1.6;
      const targetY = -progress * 2.2;
      const targetZ = 5 - progress * 2.4; // Zoom into the nest
      const targetRx = progress * 0.55; // Angle camera downwards slightly
      const targetRy = progress * Math.PI * 1.25; // Rotate scene orbit

      window.__natureTarget = {
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRx,
        ry: targetRy
      };
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Dynamic Cursor tracking backdrop glow (responsive black-green gradient) */}
      <div className="dynamic-glow-bg" />

      {/* Persistent WebGL Canvas background */}
      <div className="canvas-container">
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <NatureScene />
        </Canvas>
      </div>

      {/* Main HTML content overlays */}
      <ContentOverlay />

      {/* Custom Refraction Lens Cursors */}
      <CustomCursor />
    </>
  );
}
