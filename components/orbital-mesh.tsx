"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
   AURORA SPHERE — 3D wireframe sphere with depth & parallax
   
   Real 3D math:
   • Sphere vertices projected via perspective projection
   • Mouse controls camera rotation (parallax tilt)
   • Depth-sorted rendering for proper occlusion
   • Floating particles at multiple Z-layers
   • Central gradient glow orb
   • Trail afterglow on particles
   ───────────────────────────────────────────────────────────── */

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function rotateY(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: v.x * cos - v.z * sin, y: v.y, z: v.x * sin + v.z * cos };
}

function rotateX(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: v.x, y: v.y * cos - v.z * sin, z: v.y * sin + v.z * cos };
}

function project(
  v: Vec3,
  w: number,
  h: number,
  fov: number
): { x: number; y: number; scale: number; z: number } {
  const z = v.z + 4; // camera distance
  const scale = fov / Math.max(z, 0.1);
  return { x: v.x * scale + w / 2, y: v.y * scale + h / 2, scale, z: v.z };
}

// Generate sphere wireframe vertices
function generateSphere(
  radius: number,
  rings: number,
  segments: number
): { vertices: Vec3[]; edges: [number, number][] } {
  const vertices: Vec3[] = [];
  const edges: [number, number][] = [];

  for (let i = 0; i <= rings; i++) {
    const phi = (Math.PI * i) / rings;
    for (let j = 0; j <= segments; j++) {
      const theta = (2 * Math.PI * j) / segments;
      vertices.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      });
    }
  }

  // Connect edges along rings and segments
  for (let i = 0; i <= rings; i++) {
    for (let j = 0; j <= segments; j++) {
      const idx = i * (segments + 1) + j;
      // Horizontal ring edge
      if (j < segments) edges.push([idx, idx + 1]);
      // Vertical segment edge
      if (i < rings) edges.push([idx, idx + segments + 1]);
    }
  }

  return { vertices, edges };
}

// Floating particles at different depths
interface FloatingParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number; // 0 = white, 1 = accent
}

export function AuroraSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const rotRef = useRef({ rx: 0, ry: 0, targetRx: 0, targetRy: 0 });
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const particlesRef = useRef<FloatingParticle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const { vertices: baseVertices, edges } = useRef(
    generateSphere(1.2, 14, 20)
  ).current;

  const initParticles = useCallback(() => {
    const particles: FloatingParticle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push(spawnParticle());
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      sizeRef.current = { w: rect.width, h: rect.height };
    };

    resize();
    initParticles();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      const { w, h } = sizeRef.current;
      const t = (timeRef.current += 0.006);
      const mouse = mouseRef.current;
      const rot = rotRef.current;

      ctx.clearRect(0, 0, w, h);

      // ── Camera rotation from mouse (parallax) ──
      if (mouse.active) {
        rot.targetRy = (mouse.x - 0.5) * 0.8;
        rot.targetRx = (mouse.y - 0.5) * 0.4;
      } else {
        rot.targetRy = Math.sin(t * 0.3) * 0.15;
        rot.targetRx = Math.cos(t * 0.2) * 0.1;
      }
      rot.rx += (rot.targetRx - rot.rx) * 0.03;
      rot.ry += (rot.targetRy - rot.ry) * 0.03;

      const autoRotY = t * 0.15; // slow auto-rotation
      const camRx = rot.rx;
      const camRy = rot.ry + autoRotY;

      const fov = Math.min(w, h) * 0.45;

      // ── Central gradient glow ──
      const centerP = project({ x: 0, y: 0, z: 0 }, w, h, fov);
      const glowRadius = fov * 0.6;
      const glowGrad = ctx.createRadialGradient(
        centerP.x,
        centerP.y,
        0,
        centerP.x,
        centerP.y,
        glowRadius
      );
      glowGrad.addColorStop(0, "rgba(157, 78, 221, 0.08)");
      glowGrad.addColorStop(0.3, "rgba(157, 78, 221, 0.03)");
      glowGrad.addColorStop(0.6, "rgba(80, 20, 150, 0.01)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // ── Transform and project all vertices ──
      const projected = baseVertices.map((v) => {
        // Breathing pulse
        const pulse = 1 + Math.sin(t * 0.8) * 0.03;
        const sv = { x: v.x * pulse, y: v.y * pulse, z: v.z * pulse };
        const r1 = rotateY(sv, camRy);
        const r2 = rotateX(r1, camRx);
        return project(r2, w, h, fov);
      });

      // ── Render edges (depth-sorted by average Z) ──
      const sortedEdges = edges
        .map(([a, b]) => ({
          a,
          b,
          avgZ: (projected[a].z + projected[b].z) / 2,
        }))
        .sort((x, y) => x.avgZ - y.avgZ); // back to front

      for (const edge of sortedEdges) {
        const pa = projected[edge.a];
        const pb = projected[edge.b];
        // Depth-based opacity: closer = brighter
        const depthFactor = Math.max(
          0,
          Math.min(1, 1 - (edge.avgZ + 1.5) / 3)
        );
        const alpha = depthFactor * 0.2 + 0.02;

        // Accent tint on front-facing edges
        const isAccent = depthFactor > 0.6;

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = isAccent
          ? `rgba(157, 78, 221, ${alpha * 1.5})`
          : `rgba(0, 240, 255, ${alpha * 0.4})`;
        ctx.lineWidth = depthFactor * 1 + 0.3;
        ctx.stroke();
      }

      // ── Render vertices (glowing nodes) ──
      for (const p of projected) {
        const depthFactor = Math.max(0, Math.min(1, 1 - (p.z + 1.5) / 3));
        const radius = depthFactor * 2 + 0.5;
        const alpha = depthFactor * 0.5 + 0.05;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle =
          depthFactor > 0.5
            ? `rgba(157, 78, 221, ${alpha})`
            : `rgba(0, 240, 255, ${alpha * 0.5})`;
        ctx.fill();

        // Glow on foreground vertices
        if (depthFactor > 0.7) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius + 6, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            radius + 6
          );
          glow.addColorStop(0, `rgba(157, 78, 221, ${depthFactor * 0.15})`);
          glow.addColorStop(1, "rgba(157, 78, 221, 0)");
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }

      // ── Floating particles ──
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.life -= 1;

        if (p.life <= 0) {
          particles[i] = spawnParticle();
          continue;
        }

        const r1 = rotateY(p, camRy * 0.3);
        const r2 = rotateX(r1, camRx * 0.3);
        const pp = project(r2, w, h, fov);
        const lifeRatio = p.life / p.maxLife;
        const fadeAlpha = lifeRatio < 0.3 ? lifeRatio / 0.3 : 1;
        const depthFactor = Math.max(0, Math.min(1, 1 - (pp.z + 2) / 4));
        const alpha = fadeAlpha * depthFactor * 0.6;
        const size = p.size * pp.scale * 0.3;

        ctx.beginPath();
        ctx.arc(pp.x, pp.y, Math.max(size, 0.5), 0, Math.PI * 2);

        if (p.hue > 0.5) {
          ctx.fillStyle = `rgba(157, 78, 221, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.4})`;
        }
        ctx.fill();

        // Trail/afterglow for accent particles
        if (p.hue > 0.5 && alpha > 0.15) {
          const trailGrad = ctx.createRadialGradient(
            pp.x,
            pp.y,
            0,
            pp.x,
            pp.y,
            size + 10
          );
          trailGrad.addColorStop(0, `rgba(157, 78, 221, ${alpha * 0.3})`);
          trailGrad.addColorStop(1, "rgba(157, 78, 221, 0)");
          ctx.fillStyle = trailGrad;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, size + 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [baseVertices, edges, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

function spawnParticle(): FloatingParticle {
  const angle = Math.random() * Math.PI * 2;
  const dist = 1.5 + Math.random() * 2;
  const yAngle = (Math.random() - 0.5) * Math.PI;
  return {
    x: Math.cos(angle) * Math.cos(yAngle) * dist,
    y: Math.sin(yAngle) * dist,
    z: Math.sin(angle) * Math.cos(yAngle) * dist,
    vx: (Math.random() - 0.5) * 0.008,
    vy: (Math.random() - 0.5) * 0.005,
    vz: (Math.random() - 0.5) * 0.008,
    size: 0.5 + Math.random() * 2,
    life: 200 + Math.random() * 400,
    maxLife: 200 + Math.random() * 400,
    hue: Math.random(),
  };
}
