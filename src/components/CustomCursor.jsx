import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const lensRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isOverCanvas, setIsOverCanvas] = useState(false);

  useEffect(() => {
    // Hidden on touchscreen devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const lens = lensRef.current;

    if (!dot || !lens) return;

    // Use GSAP quickTo for smooth cursor lagging
    const setLensX = gsap.quickTo(lens, 'x', { duration: 0.3, ease: 'power3.out' });
    const setLensY = gsap.quickTo(lens, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Update immediate dot position
      gsap.set(dot, { x: clientX, y: clientY });

      // Update lagging lens position
      setLensX(clientX);
      setLensY(clientY);

      // Track pointer position on the background glow container
      const bg = document.querySelector('.dynamic-glow-bg');
      if (bg) {
        bg.style.setProperty('--mouse-x', `${(clientX / window.innerWidth) * 100}%`);
        bg.style.setProperty('--mouse-y', `${(clientY / window.innerHeight) * 100}%`);
      }

      // Check if hovering over canvas
      const target = e.target;
      const overCanvas = !!(target && typeof target.closest === 'function' && target.closest('canvas')) || !!window.__isMouseOverEarth;
      setIsOverCanvas(overCanvas);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      
      // Check if mouse is hovering over interactive elements
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.glass-panel') || 
        target.closest('.cardboard-panel') ||
        (target.classList && target.classList.contains('interactive'));

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Set the warp filter dynamically based on whether we are hovering over the 3D model
  const lensStyle = {
    filter: isOverCanvas ? 'none' : 'url(#cursor-warp)',
    backdropFilter: isOverCanvas ? 'none' : 'blur(4px) saturate(180%)',
    WebkitBackdropFilter: isOverCanvas ? 'none' : 'blur(4px) saturate(180%)',
    backgroundColor: isOverCanvas ? 'transparent' : 'rgba(57, 227, 101, 0.03)',
    borderColor: isOverCanvas ? 'rgba(57, 227, 101, 0.8)' : 'rgba(57, 227, 101, 0.4)'
  };

  return (
    <>
      {/* SVG Displacement Filter for Text Warping */}
      <svg className="warp-svg">
        <filter id="cursor-warp">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.015 0.02" 
            numOctaves="3" 
            seed="12" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="15" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
          <feGaussianBlur stdDeviation="0.2" />
        </filter>
      </svg>

      {/* The immediate tracking pointer dot */}
      <div 
        ref={dotRef} 
        className="custom-cursor-dot" 
        style={{ transform: 'translate3d(-50%, -50%, 0)' }}
      />

      {/* The lagging lens with refraction filter */}
      <div 
        ref={lensRef} 
        className={`custom-cursor-lens ${isHovering ? 'hovering' : ''}`}
        style={{ 
          transform: 'translate3d(-50%, -50%, 0)',
          ...lensStyle
        }}
      />
    </>
  );
}
