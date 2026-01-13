"use client";

import Orb from './Orb';

const HeroOrbBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none sm:pointer-events-auto">
      <Orb 
        hoverIntensity={0.5} 
        rotateOnHover={true} 
        hue={0} 
        forceHoverState={false}
        backgroundColor="#0f172a"
      />
      {/* Subtle gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 pointer-events-none z-10" />
    </div>
  );
};

export default HeroOrbBackground;

