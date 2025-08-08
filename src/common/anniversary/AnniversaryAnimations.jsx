// AnniversaryAnimations.jsx
import React, { useEffect, useRef, useState } from "react";
import confettiImport from "canvas-confetti";

// ==== ConfettiCanvas ====
const ConfettiCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const initParticles = (w, h) => {
    particles.current = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h - h,
      r: 6 + Math.random() * 6,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: 0.07 + Math.random() * 0.05,
      tiltAngle: 0,
      color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
      velocityY: 1 + Math.random() * 3,
    }));
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    initParticles(W, H);
    let animationFrame;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.current.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.velocityY;
        p.x += Math.sin(p.tiltAngle) * 0.5;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        if (p.y > H + 20) {
          p.y = -10;
          p.x = Math.random() * W;
        }
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.translate(p.x + p.tilt, p.y);
        ctx.rotate((p.tilt * Math.PI) / 180);
        ctx.fillRect(0, 0, p.r, p.r * 0.4);
        ctx.restore();
      });
      animationFrame = requestAnimationFrame(draw);
    };
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initParticles(W, H);
    };
    window.addEventListener("resize", onResize);
    draw();
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

// ==== HatDrop ====
const HatDrop = () => {
  const [hats, setHats] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 5);
      setHats((prev) => [...prev, { id, left: Math.random() * 100 }]);
      setTimeout(
        () => setHats((prev) => prev.filter((h) => h.id !== id)),
        3500
      );
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return hats.map((h) => (
    <div
      key={h.id}
      className="fixed top-0 text-2xl animate-bounce z-0"
      style={{ left: `${h.left}%` }}
    >
      🎓
    </div>
  ));
};

const AnniversaryAnimations = () => {
  return (
    <>
      <ConfettiCanvas />
      <HatDrop />
    </>
  );
};

export default AnniversaryAnimations;
