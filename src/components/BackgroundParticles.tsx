import React, { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  speed: number;
}

interface BoLeaf {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  swayWidth: number;
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Arrays to hold particles
    const orbs: Orb[] = [];
    const leaves: BoLeaf[] = [];

    // Initialize Orbs (rising up)
    const initOrbs = (count: number) => {
      for (let i = 0; i < count; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.4 + 0.2), // Rising slowly
          radius: Math.random() * 8 + 4,
          alpha: Math.random() * 0.5 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    // Initialize Bo Leaves (falling down)
    const initLeaves = (count: number) => {
      for (let i = 0; i < count; i++) {
        leaves.push({
          x: Math.random() * width,
          y: Math.random() * height - height, // Start off-screen above
          size: Math.random() * 10 + 6,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.015,
          vx: 0,
          vy: Math.random() * 0.3 + 0.25, // Falling slowly
          alpha: Math.random() * 0.4 + 0.25,
          phase: Math.random() * Math.PI * 2,
          swayWidth: Math.random() * 20 + 10,
        });
      }
    };

    initOrbs(30);
    initLeaves(15);

    // Draw a single Bo Leaf shape
    const drawBoLeafShape = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      alpha: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);

      // Saffron/Orange-gold color for a glowing Vesak vibe
      c.fillStyle = `rgba(245, 158, 11, ${alpha})`;
      c.shadowColor = `rgba(245, 158, 11, 0.5)`;
      c.shadowBlur = 12;

      c.beginPath();
      // Drawn as a delicate heart shape extending into a long slender pointed tip at the bottom
      c.moveTo(0, -size);
      
      // Top left curve
      c.bezierCurveTo(-size * 0.9, -size * 0.8, -size * 1.1, size * 0.2, -size * 0.2, size * 0.8);
      
      // Long tail/tip of the Bo leaf at the bottom
      c.quadraticCurveTo(0, size * 1.2, 0, size * 1.6);
      c.quadraticCurveTo(0, size * 1.2, size * 0.2, size * 0.8);
      
      // Top right curve
      c.bezierCurveTo(size * 1.1, size * 0.2, size * 0.9, -size * 0.8, 0, -size);
      
      c.closePath();
      c.fill();
      
      // Delicate vein in the middle
      c.strokeStyle = `rgba(255, 230, 150, ${alpha * 0.4})`;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, -size * 0.8);
      c.lineTo(0, size * 1.2);
      c.stroke();

      c.restore();
    };

    // Main loop
    const animate = () => {
      // Create trailing dark background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Add a deep ambient radial glow at the center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, '#0c1033'); // peaceful deep blue/purple glow
      gradient.addColorStop(1, '#030712'); // fade into black
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and Draw Orbs
      orbs.forEach((orb) => {
        orb.y += orb.vy;
        // Sway horizontally
        orb.phase += orb.speed;
        orb.x += Math.sin(orb.phase) * 0.2 + orb.vx;

        // Reset orb if it moves off-screen top/left/right
        if (orb.y < -30) {
          orb.y = height + 30;
          orb.x = Math.random() * width;
        }
        if (orb.x < -30 || orb.x > width + 30) {
          orb.x = Math.random() * width;
        }

        // Pulse intensity slightly
        const pulse = Math.sin(orb.phase) * 0.15 + 0.85;

        // Draw glowing orb
        ctx.save();
        const radGrad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius * 2
        );
        radGrad.addColorStop(0, `rgba(253, 186, 116, ${orb.alpha * pulse})`); // soft orange
        radGrad.addColorStop(0.3, `rgba(245, 158, 11, ${orb.alpha * pulse * 0.5})`);
        radGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Update and Draw Bo Leaves
      leaves.forEach((leaf) => {
        leaf.y += leaf.vy;
        leaf.phase += 0.015;
        // Natural swaying motion
        leaf.x += Math.sin(leaf.phase) * 0.4;
        leaf.rotation += leaf.rotationSpeed;

        // Reset if it goes off bottom or sides
        if (leaf.y > height + 40) {
          leaf.y = -50;
          leaf.x = Math.random() * width;
        }
        if (leaf.x < -40 || leaf.x > width + 40) {
          leaf.x = Math.random() * width;
        }

        drawBoLeafShape(ctx, leaf.x, leaf.y, leaf.size, leaf.rotation, leaf.alpha);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Event listener for resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};
