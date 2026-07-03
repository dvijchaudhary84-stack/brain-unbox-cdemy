import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import NatureScene from './components/NatureScene';
import ContentOverlay from './components/ContentOverlay';

export default function App() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      const mobileWidth = window.innerWidth <= 768;
      const touchDevice = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobileWidth || touchDevice);
    };

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // Hidden on touch screen devices
    if (isMobile) {
      document.body.style.cursor = 'auto';
      const styles = document.createElement('style');
      styles.innerHTML = '* { cursor: auto !important; }';
      document.head.appendChild(styles);
    }

    // Initial 3D camera target state
    window.__natureTarget = { x: 0, y: 0, z: 5, rx: 0, ry: 0 };

    // GSAP scroll coordinates mapping logic
    const handleScroll = ({ scroll, limit }) => {
      const progress = scroll / limit || 0;

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

    let lenis;
    let handleNativeScroll;

    if (!isMobile) {
      // Initialize Lenis smooth scroll ONLY on non-touch screens (Desktop)
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential deceleration
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        infinite: false,
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      lenis.on('scroll', handleScroll);
    } else {
      // Direct native scroll binding on mobile/touch screen devices for 60fps scrolling
      handleNativeScroll = () => {
        const scroll = window.scrollY;
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        handleScroll({ scroll, limit });
      };
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
    }

    return () => {
      if (lenis) lenis.destroy();
      if (handleNativeScroll) window.removeEventListener('scroll', handleNativeScroll);
    };
  }, [isMobile]);

  return (
    <>
      {/* Dynamic Cursor tracking backdrop glow (responsive black-green gradient) */}
      <div className="dynamic-glow-bg" />

      {/* Persistent WebGL Canvas background */}
      <div className="canvas-container">
        <Canvas 
          shadows={!isMobile} 
          camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: !isMobile, 
            alpha: true, 
            powerPreference: 'high-performance' 
          }}
        >
          <NatureScene key={isMobile ? 'mobile' : 'desktop'} />
        </Canvas>
      </div>

      {/* Main HTML content overlays */}
      <ContentOverlay />

      {/* Custom Refraction Lens Cursors */}
      <CustomCursor />
    </>
  );
}
