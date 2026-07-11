import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import NatureScene from './components/NatureScene';
import ContentOverlay from './components/ContentOverlay';

export default function App() {
  const [detectedMobile, setDetectedMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  });

  const [viewMode, setViewMode] = useState(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('viewMode') || null;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      const mobileWidth = window.innerWidth <= 768;
      const touchDevice = window.matchMedia('(pointer: coarse)').matches;
      setDetectedMobile(mobileWidth || touchDevice);
    };

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const isMobileLayout = viewMode === 'mobile' || (viewMode === null && detectedMobile);

  useEffect(() => {
    // Toggle body class for hiding default cursor (only active in desktop mode)
    if (viewMode === 'desktop') {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
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

    if (!isMobileLayout) {
      // Initialize Lenis smooth scroll ONLY on desktop layout mode
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
      // Direct native scroll binding on mobile layout mode
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
  }, [isMobileLayout]);

  const handleSelectView = (mode) => {
    sessionStorage.setItem('viewMode', mode);
    setViewMode(mode);
  };

  const natureViewMode = viewMode === null ? (detectedMobile ? 'mobile' : 'desktop') : viewMode;

  return (
    <>
      {/* Dynamic Cursor tracking backdrop glow */}
      <div className="dynamic-glow-bg" />

      {/* Persistent WebGL Canvas background */}
      <div className="canvas-container">
        <Canvas 
          shadows={natureViewMode === 'desktop'} 
          camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: natureViewMode === 'desktop', 
            alpha: true, 
            powerPreference: 'high-performance' 
          }}
        >
          <NatureScene key={natureViewMode} viewMode={natureViewMode} />
        </Canvas>
      </div>

      {/* Selector Screen Gateway */}
      {viewMode === null && (
        <div className="gateway-overlay">
          <div className="gateway-card glass-panel">
            <img src="/logo.jpg" alt="Logo" className="gateway-logo" />
            <h2 className="gateway-title glow-text">BRAIN UNBOX ACADEMY</h2>
            <p className="gateway-subtitle">Select your visual biology learning experience</p>

            <div className="gateway-options">
              <button 
                onClick={() => handleSelectView('mobile')} 
                className={`gateway-option-btn glass-panel ${detectedMobile ? 'recommended' : ''}`}
              >
                {detectedMobile && <span className="recommendation-badge">Recommended</span>}
                <div className="option-icon">📱</div>
                <h3>Mobile Phone View</h3>
                <ul>
                  <li>⚡ Fast, single-tab clean layout</li>
                  <li>🚀 Battery friendly, smooth graphics</li>
                  <li>🌿 Zero vertical clutter or congestion</li>
                  <li>🎬 Active 3D focus shifts</li>
                </ul>
              </button>

              <button 
                onClick={() => handleSelectView('desktop')} 
                className={`gateway-option-btn glass-panel ${!detectedMobile ? 'recommended' : ''}`}
              >
                {!detectedMobile && <span className="recommendation-badge">Recommended</span>}
                <div className="option-icon">🖥️</div>
                <h3>Desktop / PC View</h3>
                <ul>
                  <li>🌌 Full 3D scrolling forest</li>
                  <li>☀️ Real-time shadows & sun rays</li>
                  <li>🎭 Full-screen parallax panels</li>
                  <li>💡 High-fidelity visual details</li>
                </ul>
              </button>
            </div>
            
            <p className="gateway-footer">Both layouts contain full registration options & courses.</p>
          </div>
        </div>
      )}

      {/* Main HTML content overlays */}
      {viewMode !== null && (
        <ContentOverlay viewMode={viewMode} setViewMode={setViewMode} />
      )}

      {/* Custom Refraction Lens Cursors */}
      {!isMobileLayout && viewMode !== null && <CustomCursor />}
    </>
  );
}
