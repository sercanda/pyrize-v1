"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  enableMagnetism?: boolean;
}

export function MagneticCard({ children, className = "", enableMagnetism = true }: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!enableMagnetism || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const magnetX = (x - centerX) * 0.05;
      const magnetY = (y - centerY) * 0.05;

      magnetismAnimationRef.current?.kill();
      magnetismAnimationRef.current = gsap.to(element, {
        x: magnetX,
        y: magnetY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      magnetismAnimationRef.current?.kill();
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      magnetismAnimationRef.current?.kill();
    };
  }, [enableMagnetism]);

  return (
    <div ref={cardRef} className={className} style={{ transform: "translate(0, 0)" }}>
      {children}
    </div>
  );
}













