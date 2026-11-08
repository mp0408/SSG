'use client';

import { useEffect, useRef, useState } from 'react';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './heroShader';

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== 'production') console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

/**
 * The hero's "0": a CSS ball first, upgraded to a small WebGL ball when the device can.
 * Canvas covers only the ball and its halo. Resolution drops itself on slow
 * devices, and it stops rendering off screen, in hidden tabs and for reduced motion.
 */
export default function HeroBall() {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const host = hostRef.current;
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 size-full opacity-0 transition-opacity duration-500';
    host.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    const program = gl && createProgram(gl);
    if (!gl || !program) {
      canvas.remove();
      return undefined;
    }

    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name) => gl.getUniformLocation(program, name);
    const u = { resolution: uniform('uResolution'), scale: uniform('uScale'), tilt: uniform('uTilt'), spin: uniform('uSpin') };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let quality = 1;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2) * quality;
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.resolution, width, height);
    };

    const start = performance.now();
    let last = start;
    let spin = 0;
    const tilt = { x: 0, y: 0 };
    const tiltTarget = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    let ready = false;
    let sampled = 0;
    let slow = 0;

    const render = (now) => {
      frame = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const intro = reduceMotion ? 1 : Math.min(1, (now - start) / 1100);
      if (!reduceMotion) spin += dt * (0.85 + (1 - intro) * 9);
      const follow = Math.min(1, dt * 4);
      tilt.x += (tiltTarget.x - tilt.x) * follow;
      tilt.y += (tiltTarget.y - tilt.y) * follow;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.spin, spin);
      gl.uniform1f(u.scale, easeOutBack(intro));
      gl.uniform2f(u.tilt, tilt.x, tilt.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!ready) {
        ready = true;
        canvas.style.opacity = '1';
        setStatus('on');
      }

      // Adaptive resolution: if many of the last 60 frames were slow, render fewer pixels.
      if (!reduceMotion && quality > 0.5) {
        sampled += 1;
        if (dt > 0.024) slow += 1;
        if (sampled === 60) {
          if (slow > 20) {
            quality = Math.max(0.5, quality * 0.75);
            measure();
          }
          sampled = 0;
          slow = 0;
        }
      }

      if (visible && !document.hidden && (!reduceMotion || intro < 1)) frame = requestAnimationFrame(render);
    };

    const invalidate = () => {
      if (!frame && visible && !document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      invalidate();
    });
    resizeObserver.observe(host);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) invalidate();
    });
    intersection.observe(host);

    const onVisibility = () => !document.hidden && invalidate();
    document.addEventListener('visibilitychange', onVisibility);

    const onPointer = (event) => {
      tiltTarget.x = (event.clientX / window.innerWidth - 0.5) * 0.5;
      tiltTarget.y = (event.clientY / window.innerHeight - 0.5) * 0.35;
    };
    if (finePointer && !reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true });

    const onLost = (event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      canvas.style.opacity = '0';
      setStatus('pending');
    };
    canvas.addEventListener('webglcontextlost', onLost);

    measure();
    invalidate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, []);

  return (
    <span data-gl={status} className="ball-slot mr-[0.03em]">
      <span className="ball-orbit" />
      <span className="ball-orbit" />
      <span ref={hostRef} className="absolute -inset-1/4" />
    </span>
  );
}
