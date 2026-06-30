import React, { useRef } from 'react';

export default function InteractiveTilt({ children, className, style, maxRotation = 15, scale = 1.04 }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    
    // Position of cursor relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Relative coordinates from center (-1 to 1)
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = -((y - yc) / yc) * maxRotation;
    const rotateY = ((x - xc) / xc) * maxRotation;
    
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 0) return;
    const card = cardRef.current;
    if (!card) return;
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Clamp inside borders
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));
    
    const rotateX = -((clampedY - yc) / yc) * maxRotation;
    const rotateY = ((clampedX - xc) / xc) * maxRotation;
    
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const handleReset = () => {
    const card = cardRef.current;
    if (!card) return;
    // Smooth snap reset
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleReset}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleReset}
      onTouchCancel={handleReset}
    >
      {children}
    </div>
  );
}
