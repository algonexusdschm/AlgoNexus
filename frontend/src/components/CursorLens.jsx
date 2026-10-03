import React, { useEffect, useRef } from 'react';

export default function CursorLens() {
  const lensRef = useRef(null);
  const coreRef = useRef(null);

  useEffect(() => {
    const lens = lensRef.current;
    const core = coreRef.current;
    if (!lens || !core) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Lens lags slightly for that smooth "fluid" magical feel
    let lensX = window.innerWidth / 2;
    let lensY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // The tiny core dot follows the cursor instantly
      core.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;
    const animate = () => {
      // Smooth linear interpolation (lerp) for the big lens
      lensX += (mouseX - lensX) * 0.12;
      lensY += (mouseY - lensY) * 0.12;

      // Center the 300px lens over the mouse (-150px offset)
      lens.style.transform = `translate3d(${lensX - 150}px, ${lensY - 150}px, 0)`;

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* The Inverted Multiverse Spotlight Lens */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[35]"
        style={{
          // 'difference' blends against dark backgrounds to create an inverted/negative space effect
          mixBlendMode: 'difference',
          background: 'radial-gradient(circle, rgba(255,255,255,1) 15%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 100%)',
          willChange: 'transform'
        }}
      />
      
      {/* Tiny Core Energy Dot (Always on top) */}
      <div 
        ref={coreRef}
        className="fixed top-0 left-0 w-[8px] h-[8px] bg-emerald-400 rounded-full pointer-events-none z-[60] shadow-[0_0_15px_#10b981]"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
