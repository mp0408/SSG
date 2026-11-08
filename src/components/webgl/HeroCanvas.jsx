import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/cn';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './heroShader';

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.error(gl.getShaderInfoLog(shader));
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
    if (import.meta.env.DEV) console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

/**
 * Full-bleed WebGL background for the hero. The ball is drawn wherever
 * `anchorRef` sits in the layout, so typography and 3D stay aligned at every
 * breakpoint. Reports 'on' | 'fail' through onStatus.
 *
 * Performance: capped DPR, render-scale that drops automatically on slow
 * devices, paused when off-screen or the tab is hidden, single static frame
 * for prefers-reduced-motion.
 */
export default function HeroCanvas({ anchorRef, onStatus, className }) {
  const hostRef = useRef(null);
  const { theme } = useTheme();
  const themeTarget = useRef(theme === 'light' ? 1 : 0);
  const invalidateRef = useRef(() => {});
  const onStatusRef = useRef(onStatus);

  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    themeTarget.current = theme === 'light' ? 1 : 0;
    invalidateRef.current();
  }, [theme]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 size-full opacity-0 transition-opacity duration-700';
    host.appendChild(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    const program = gl && createProgram(gl);
    if (!gl || !program) {
      canvas.remove();
      onStatusRef.current?.('fail');
      return undefined;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name) => gl.getUniformLocation(program, name);
    const u = {
      resolution: uniform('uResolution'),
      time: uniform('uTime'),
      theme: uniform('uTheme'),
      ball: uniform('uBall'),
      tilt: uniform('uTilt'),
      spin: uniform('uSpin'),
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const maxDpr = finePointer ? 1.75 : 1.5;
    let quality = finePointer ? 1 : 0.8;
    let ratio = 1;
    const ball = { x: 0, y: 0, r: 0 };

    const measure = () => {
      const rect = host.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, maxDpr) * quality;
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.resolution, width, height);
      const anchor = anchorRef.current?.getBoundingClientRect();
      if (anchor?.width) {
        ball.x = (anchor.left + anchor.width / 2 - rect.left) * ratio;
        ball.y = (rect.bottom - (anchor.top + anchor.height / 2)) * ratio;
        ball.r = (anchor.width / 2) * ratio;
      }
    };

    const start = performance.now();
    let last = start;
    let time = 0;
    let spin = 0;
    let themeValue = themeTarget.current;
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
      const intro = reduceMotion ? 1 : Math.min(1, (now - start) / 1500);
      if (!reduceMotion) {
        time += dt;
        spin += dt * (0.85 + (1 - intro) * 10);
      }
      const follow = Math.min(1, dt * 4);
      tilt.x += (tiltTarget.x - tilt.x) * follow;
      tilt.y += (tiltTarget.y - tilt.y) * follow;
      themeValue += (themeTarget.current - themeValue) * Math.min(1, dt * 7 || 1);
      if (reduceMotion) themeValue = themeTarget.current;

      gl.uniform1f(u.time, time);
      gl.uniform1f(u.theme, themeValue);
      gl.uniform1f(u.spin, spin);
      gl.uniform2f(u.tilt, tilt.x, tilt.y);
      gl.uniform3f(u.ball, ball.x, ball.y, ball.r * easeOutBack(intro));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!ready) {
        ready = true;
        canvas.style.opacity = '1';
        onStatusRef.current?.('on');
      }

      // Adaptive resolution: if most of the last 90 frames were slow, render fewer pixels.
      if (!reduceMotion && quality > 0.5) {
        sampled += 1;
        if (dt > 0.026) slow += 1;
        if (sampled === 90) {
          if (slow > 35) {
            quality = Math.max(0.5, quality * 0.75);
            measure();
          }
          sampled = 0;
          slow = 0;
        }
      }

      const settling = Math.abs(themeTarget.current - themeValue) > 0.002 || intro < 1;
      if (visible && !document.hidden && (!reduceMotion || settling)) frame = requestAnimationFrame(render);
    };

    const invalidate = () => {
      if (!frame && visible && !document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    invalidateRef.current = invalidate;

    const onResize = () => {
      measure();
      invalidate();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);
    if (anchorRef.current) resizeObserver.observe(anchorRef.current);

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
      if (reduceMotion) return;
      invalidate();
    };
    if (finePointer && !reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true });

    const onLost = (event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      onStatusRef.current?.('fail');
    };
    canvas.addEventListener('webglcontextlost', onLost);

    document.fonts?.ready.then(onResize);
    measure();
    invalidate();

    return () => {
      cancelAnimationFrame(frame);
      invalidateRef.current = () => {};
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
  }, [anchorRef]);

  return <div ref={hostRef} aria-hidden className={cn('absolute inset-0 overflow-hidden', className)} />;
}
