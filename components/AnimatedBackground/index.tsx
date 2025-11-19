import { useEffect, useRef, useState } from "react";

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect theme from DOM
  useEffect(() => {
    setMounted(true);
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse position tracking - use window events to bypass custom cursor
    const mousePos = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Check if mouse is within canvas bounds
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;
      } else {
        // Reset if outside canvas
        mousePos.x = -1000;
        mousePos.y = -1000;
      }
    };

    const handleMouseLeave = () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
    };

    // Use window events instead of canvas events to bypass custom cursor blocking
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Also listen on canvas as backup
    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Theme-based colors
    const getParticleColors = () => {
      if (isDark) {
        // Dark mode: subtle colors that work on black background
        return [
          "rgba(248, 107, 223, 0.4)", // Pink - more subtle
          "rgba(107, 107, 248, 0.4)", // Blue - more subtle
          "rgba(255, 255, 255, 0.15)", // White - very subtle
        ];
      } else {
        // Light mode: soft pastel colors that work on white background
        return [
          "rgba(248, 107, 223, 0.25)", // Pink - soft
          "rgba(107, 107, 248, 0.25)", // Blue - soft
          "rgba(0, 0, 0, 0.08)", // Black - very subtle
        ];
      }
    };

    const getGradientColors = () => {
      if (isDark) {
        // Dark mode: subtle gradient
        return [
          "rgba(248, 107, 223, 0.08)",
          "rgba(107, 107, 248, 0.08)",
          "rgba(248, 107, 223, 0.08)",
        ];
      } else {
        // Light mode: very subtle gradient
        return [
          "rgba(248, 107, 223, 0.05)",
          "rgba(107, 107, 248, 0.05)",
          "rgba(248, 107, 223, 0.05)",
        ];
      }
    };

    const particleColors = getParticleColors();
    const gradientColors = getGradientColors();

    // Particle system
    interface Particle {
      x: number;
      y: number;
      radius: number;
      originalRadius?: number;
      vx: number;
      vy: number;
      opacity: number;
      color: string;
      isMutated?: boolean; // Flag for particles created by mutation
      mutationTimer?: number; // Timer to track how long particle has been mutated
    }

    const particles: Particle[] = [];
    const particleCount = 50;
    const mutationRadius = 200; // Radius for mutation effect
    const mutationInterval = 100; // Time in frames to create new particles
    let mutationCounter = 0;

    // Create particles with theme-based colors
    for (let i = 0; i < particleCount; i++) {
      const colorIndex = i % 3;
      const baseOpacity = isDark ? 0.3 : 0.2;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2.5, // Increased size: 2.5-5.5px
        vx: (Math.random() - 0.5) * 1.5, // Increased velocity: -0.75 to 0.75
        vy: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.3 + baseOpacity,
        color: particleColors[colorIndex],
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mutation system - create new particles near mouse
      if (mousePos.x > 0 && mousePos.y > 0) {
        mutationCounter++;
        if (mutationCounter >= mutationInterval) {
          mutationCounter = 0;

          // Count particles in mutation radius
          const particlesInRadius = particles.filter((p) => {
            const dx = mousePos.x - p.x;
            const dy = mousePos.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < mutationRadius;
          });

          // Create new particles if there are particles in radius and not too many
          if (particlesInRadius.length > 0 && particles.length < 150) {
            const baseParticle =
              particlesInRadius[
                Math.floor(Math.random() * particlesInRadius.length)
              ];

            // Create 2-3 new particles near the base particle
            const newParticleCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < newParticleCount; i++) {
              const angle =
                (Math.PI * 2 * i) / newParticleCount + Math.random() * 0.5;
              const distance = 20 + Math.random() * 30;
              const colorIndex = Math.floor(Math.random() * 3);

              particles.push({
                x: baseParticle.x + Math.cos(angle) * distance,
                y: baseParticle.y + Math.sin(angle) * distance,
                radius: Math.random() * 2 + 1.5,
                originalRadius: Math.random() * 2 + 1.5,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: isDark ? 0.4 : 0.25,
                color: particleColors[colorIndex],
                isMutated: true,
                mutationTimer: 0,
              });
            }
          }
        }
      }

      // Remove mutated particles that are far from mouse
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (particle.isMutated) {
          if (particle.mutationTimer !== undefined) {
            particle.mutationTimer++;
          }

          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Remove if too far from mouse or timer expired
          if (
            distance > mutationRadius * 1.5 ||
            (particle.mutationTimer && particle.mutationTimer > 300)
          ) {
            particles.splice(i, 1);
          }
        }
      }

      // Update and draw particles
      particles.forEach((particle) => {
        // Mouse interaction - magnetic effect
        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = mutationRadius; // Maximum interaction distance
        const strongDistance = 80; // Strong magnetic field distance

        if (distance < maxDistance && mousePos.x > 0 && mousePos.y > 0) {
          // Strong magnetic attraction - exponential force
          const normalizedDistance = distance / maxDistance;
          const forceMultiplier =
            distance < strongDistance
              ? Math.pow(1 - distance / strongDistance, 2) * 2 // Very strong when close
              : Math.pow(1 - normalizedDistance, 1.5); // Exponential decay

          const force = forceMultiplier * 0.3; // Much stronger base force
          const angle = Math.atan2(dy, dx);

          // Strong magnetic pull towards mouse
          particle.vx += Math.cos(angle) * force;
          particle.vy += Math.sin(angle) * force;

          // Magnetic field effect - particles also attract to each other in radius
          particles.forEach((other) => {
            if (other === particle) return;
            const otherDx = other.x - particle.x;
            const otherDy = other.y - particle.y;
            const otherDistance = Math.sqrt(
              otherDx * otherDx + otherDy * otherDy
            );

            // Check if both particles are in mouse radius
            const otherDxToMouse = mousePos.x - other.x;
            const otherDyToMouse = mousePos.y - other.y;
            const otherDistToMouse = Math.sqrt(
              otherDxToMouse * otherDxToMouse + otherDyToMouse * otherDyToMouse
            );

            if (otherDistance < 80 && otherDistToMouse < maxDistance) {
              // Particles attract each other (magnetic bonding)
              const bondForce = (1 - otherDistance / 80) * 0.05;
              const bondAngle = Math.atan2(otherDy, otherDx);
              particle.vx += Math.cos(bondAngle) * bondForce;
              particle.vy += Math.sin(bondAngle) * bondForce;
            }
          });

          // Increase opacity and size when in magnetic field
          const sizeMultiplier =
            distance < strongDistance
              ? 1.8
              : 1 + (1 - normalizedDistance) * 0.5;
          particle.opacity = Math.min(
            particle.opacity + force * 4,
            isDark ? 0.9 : 0.7
          );

          // Store original radius for size animation
          if (!particle.originalRadius) {
            particle.originalRadius = particle.radius;
          }
          particle.radius = (particle.originalRadius || 2.5) * sizeMultiplier;
        } else {
          // Gradually return to normal when leaving magnetic field
          const baseOpacity = isDark ? 0.3 : 0.2;
          particle.opacity += (baseOpacity - particle.opacity) * 0.08;

          if (particle.originalRadius) {
            particle.radius +=
              ((particle.originalRadius || 2.5) - particle.radius) * 0.15;
          }
        }

        // Apply minimal friction to keep particles moving
        particle.vx *= 0.995; // Reduced friction
        particle.vy *= 0.995;

        // Ensure minimum velocity to keep particles moving
        const minVelocity = 0.1;
        if (
          Math.abs(particle.vx) < minVelocity &&
          Math.abs(particle.vy) < minVelocity
        ) {
          // Add small random velocity if particle is too slow
          particle.vx += (Math.random() - 0.5) * 0.2;
          particle.vy += (Math.random() - 0.5) * 0.2;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(
          /[\d\.]+\)$/g,
          `${particle.opacity})`
        );
        ctx.fill();

        // Draw connections to other particles - stronger in magnetic field
        particles.forEach((other) => {
          if (other === particle) return;
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Check if particles are in mouse magnetic field
          const particleDxToMouse = mousePos.x - particle.x;
          const particleDyToMouse = mousePos.y - particle.y;
          const particleDistToMouse = Math.sqrt(
            particleDxToMouse * particleDxToMouse +
              particleDyToMouse * particleDyToMouse
          );

          const otherDxToMouse = mousePos.x - other.x;
          const otherDyToMouse = mousePos.y - other.y;
          const otherDistToMouse = Math.sqrt(
            otherDxToMouse * otherDxToMouse + otherDyToMouse * otherDyToMouse
          );

          const inMagneticField =
            particleDistToMouse < mutationRadius &&
            otherDistToMouse < mutationRadius;
          const connectionDistance = inMagneticField ? 100 : 150; // Closer connections in field
          const connectionOpacity = inMagneticField ? 0.4 : 0.2; // Stronger connections in field

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            const lineOpacity =
              (1 - distance / connectionDistance) * connectionOpacity;
            ctx.strokeStyle = particle.color.replace(
              /[\d\.]+\)$/g,
              `${lineOpacity})`
            );
            ctx.lineWidth = inMagneticField ? 1 : 0.5; // Thicker lines in field
            ctx.stroke();
          }
        });

        // Draw connection to mouse if close
        if (mousePos.x > 0 && mousePos.y > 0) {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = particle.color.replace(
              /[\d\.]+\)$/g,
              `${opacity})`
            );
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Draw gradient overlay with theme-based colors
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, gradientColors[0]);
      gradient.addColorStop(0.5, gradientColors[1]);
      gradient.addColorStop(1, gradientColors[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mounted, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0, pointerEvents: "auto" }}
    />
  );
};

export default AnimatedBackground;
