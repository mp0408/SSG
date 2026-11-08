import { useEffect, useId, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { BATTER_PATH } from '../brand/logoPaths';

/**
 * Animated footer scene: a floodlit ground seen from the bowler's end.
 * Deliveries alternate — a clean-bowled wicket, then a six over the rope.
 * Pure SVG with transform/opacity animation; only plays while visible.
 */

/* Each delivery: total duration + keyframes (with matching `times`) per actor. */
const DELIVERIES = {
  bowled: {
    duration: 3.4,
    ball: {
      times: [0, 0.5, 0.72, 0.86, 1],
      x: [652, 607, 600, 594, 586],
      y: [318, 222, 157, 146, 138],
      scale: [1.6, 0.95, 0.66, 0.62, 0.58],
      opacity: [0, 1, 1, 1, 0],
      rotate: [0, 540, 860, 920, 960],
    },
    shadow: {
      times: [0, 0.5, 0.72, 0.86, 1],
      x: [652, 607, 600, 596, 590],
      y: [372, 224, 173, 173, 173],
      scale: [1.4, 0.95, 0.66, 0.62, 0.58],
      opacity: [0, 0.55, 0.35, 0.15, 0],
    },
    offStump: { times: [0, 0.71, 0.72, 0.88, 1], rotate: [0, 0, -9, -6, 0] },
    middleStump: { times: [0, 0.71, 0.72, 0.88, 1], rotate: [0, 0, 14, 10, 0] },
    leftBail: { times: [0, 0.71, 0.72, 0.88, 1], x: [0, 0, 0, -38, -60], y: [0, 0, 0, -46, 30], rotate: [0, 0, 0, -260, -420], opacity: [1, 1, 1, 1, 0] },
    rightBail: { times: [0, 0.71, 0.72, 0.88, 1], x: [0, 0, 0, 34, 56], y: [0, 0, 0, -54, 26], rotate: [0, 0, 0, 300, 460], opacity: [1, 1, 1, 1, 0] },
    call: { times: [0, 0.72, 0.77, 0.93, 1], opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1.08, 1, 1] },
  },
  six: {
    duration: 4.2,
    ball: {
      // delivered → pitches → meets the bat → rides the arc over the rope
      times: [0, 0.38, 0.55, 0.65, 0.75, 0.85, 0.93, 1],
      x: [652, 607, 594, 527, 446, 354, 250, 200],
      y: [318, 222, 152, 83, 42, 28, 40, 60],
      scale: [1.6, 0.95, 0.66, 0.75, 0.86, 0.96, 1.05, 1.1],
      opacity: [0, 1, 1, 1, 1, 1, 1, 0],
      rotate: [0, 420, 700, 900, 1080, 1260, 1400, 1480],
    },
    shadow: {
      times: [0, 0.38, 0.55, 0.7, 1],
      x: [652, 607, 596, 540, 470],
      y: [372, 224, 173, 200, 240],
      scale: [1.4, 0.95, 0.66, 0.8, 1],
      opacity: [0, 0.55, 0.35, 0.12, 0],
    },
    batter: { times: [0, 0.5, 0.55, 0.62, 0.8, 1], rotate: [0, -6, -16, 10, 0, 0] },
    trail: { times: [0, 0.55, 0.56, 0.93, 1], pathLength: [0, 0, 0.02, 1, 1], opacity: [0, 0, 0.8, 0.8, 0] },
    call: { times: [0, 0.62, 0.7, 0.92, 1], opacity: [0, 0, 1, 1, 0], scale: [0.4, 0.4, 1.18, 1, 1] },
    burst: { times: [0, 0.64, 0.66, 0.84, 1], opacity: [0, 0, 1, 0, 0] },
  },
};
const ORDER = ['bowled', 'six'];
const GAP = 1.1; // seconds between deliveries

const BATTER_SCALE = 66 / 1375;
const BATTER_TRANSFORM = `translate(${538 - 21 * BATTER_SCALE} ${108 - 24 * BATTER_SCALE}) scale(${BATTER_SCALE})`;
const SIX_ARC = 'M596 150 Q470 -10 250 40';
const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return { dx: Math.cos(angle) * 70, dy: Math.sin(angle) * 34 };
});

function Floodlight({ x, flip, playing, glowId }) {
  return (
    <g>
      <motion.path
        d={flip ? `M${x - 10} 70 L${x - 330} 330 L${x - 150} 330 Z` : `M${x + 10} 70 L${x + 330} 330 L${x + 150} 330 Z`}
        fill={`url(#${glowId})`}
        animate={playing ? { opacity: [0.35, 0.6, 0.35] } : { opacity: 0.45 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1={x} y1="72" x2={x} y2="250" stroke="rgb(var(--ink) / 0.18)" strokeWidth="2" />
      <rect x={x - 16} y="56" width="32" height="18" rx="3" fill="rgb(var(--ink) / 0.22)" />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={x - 10 + i * 10}
          cy="65"
          r="3.2"
          fill="#fdf6d8"
          animate={playing ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.9 }}
          transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}

export default function FooterPitch({ className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();
  const playing = inView && !reduce;
  const [count, setCount] = useState(0);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const field = `field-${id}`;
  const glow = `glow-${id}`;
  const strip = `strip-${id}`;

  const kind = ORDER[count % ORDER.length];
  const delivery = DELIVERIES[kind];

  // Queue the next delivery once this one (plus a breather) has finished.
  useEffect(() => {
    if (!playing) return undefined;
    const timer = setTimeout(() => setCount((c) => c + 1), (delivery.duration + GAP) * 1000);
    return () => clearTimeout(timer);
  }, [playing, count, delivery.duration]);

  /** Keyframe props for one actor in the current delivery (static when paused). */
  const act = (track) => {
    if (!playing || !track) return {};
    const { times, ...values } = track;
    return { animate: values, transition: { duration: delivery.duration, times, ease: 'linear' } };
  };

  return (
    <div ref={ref} aria-hidden className={className}>
      <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" className="size-full">
        <defs>
          <radialGradient id={field} cx="0.5" cy="0.15" r="0.75">
            <stop offset="0" stopColor="rgb(var(--brand) / 0.20)" />
            <stop offset="0.55" stopColor="rgb(var(--surface-2) / 0.75)" />
            <stop offset="1" stopColor="rgb(var(--bg-2) / 0)" />
          </radialGradient>
          <linearGradient id={glow} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dbe7ff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#dbe7ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={strip} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--ink) / 0.10)" />
            <stop offset="1" stopColor="rgb(var(--ink) / 0.16)" />
          </linearGradient>
        </defs>

        {/* Ground: outfield, boundary rope, 30-yard circle */}
        <ellipse cx="600" cy="560" rx="820" ry="390" fill={`url(#${field})`} />
        <ellipse cx="600" cy="560" rx="800" ry="378" fill="none" stroke="rgb(var(--ink) / 0.14)" strokeWidth="2" />
        <motion.ellipse
          cx="600"
          cy="470"
          rx="430"
          ry="200"
          fill="none"
          stroke="rgb(var(--ink) / 0.16)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          animate={playing ? { strokeDashoffset: [0, -64] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={`l${i}`} d={`M${380 - i * 70} 420 L${560 - i * 8} 190 L${566 - i * 8} 190 L${420 - i * 70} 420 Z`} fill="rgb(var(--ink) / 0.025)" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={`r${i}`} d={`M${780 + i * 70} 420 L${634 + i * 8} 190 L${640 + i * 8} 190 L${820 + i * 70} 420 Z`} fill="rgb(var(--ink) / 0.025)" />
        ))}

        <Floodlight x={150} playing={playing} glowId={glow} />
        <Floodlight x={1050} flip playing={playing} glowId={glow} />

        {/* Pitch strip in perspective + creases */}
        <path d="M574 168 L626 168 L688 420 L512 420 Z" fill={`url(#${strip})`} stroke="rgb(var(--ink) / 0.12)" />
        <g stroke="rgb(var(--ink) / 0.55)" strokeLinecap="round">
          <line x1="566" y1="180" x2="634" y2="180" strokeWidth="1.5" />
          <line x1="574" y1="172" x2="626" y2="172" strokeWidth="1" />
          <line x1="500" y1="392" x2="700" y2="392" strokeWidth="2.5" />
          <line x1="580" y1="172" x2="578" y2="186" strokeWidth="1" />
          <line x1="620" y1="172" x2="622" y2="186" strokeWidth="1" />
        </g>

        {/* Everything below restarts with each delivery */}
        <g key={count}>
          {/* Six: broadcast-style trajectory */}
          {kind === 'six' && playing && (
            <motion.path
              d={SIX_ARC}
              fill="none"
              stroke="rgb(var(--glow))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 7"
              initial={{ pathLength: 0, opacity: 0 }}
              {...act(delivery.trail)}
            />
          )}

          {/* Batter (from the SSG mark) — swings on the six */}
          <motion.g style={{ originX: 0.35, originY: 1 }} {...act(delivery.batter)}>
            <path d={BATTER_PATH} transform={BATTER_TRANSFORM} fillRule="evenodd" fill="rgb(var(--brand-ink) / 0.9)" />
          </motion.g>

          <motion.ellipse cx="0" cy="0" rx="9" ry="3" fill="rgb(0 0 0 / 0.55)" initial={{ x: 600, y: 173, opacity: 0 }} {...act(delivery.shadow)} />

          {/* Striker's-end stumps */}
          <g fill="rgb(var(--ink) / 0.92)">
            <motion.rect x="589" y="137" width="3" height="35" rx="1" style={{ originX: 0.5, originY: 1 }} {...act(delivery.offStump)} />
            <motion.rect x="598.5" y="137" width="3" height="35" rx="1" style={{ originX: 0.5, originY: 1 }} {...act(delivery.middleStump)} />
            <rect x="608" y="137" width="3" height="35" rx="1" />
            <motion.rect x="588" y="134" width="11" height="2.6" rx="1.3" {...act(delivery.leftBail)} />
            <motion.rect x="600" y="134" width="11" height="2.6" rx="1.3" {...act(delivery.rightBail)} />
          </g>

          {/* The ball */}
          <motion.g initial={{ x: 600, y: 157, opacity: playing ? 0 : 1, scale: 0.66 }} {...act(delivery.ball)}>
            <circle r="10" fill="#d42a35" />
            <path d="M-10 0 A10 10 0 0 0 10 0" fill="none" stroke="#f6e9c9" strokeWidth="1.6" strokeDasharray="1.8 1.6" />
            <path d="M-10 -2.2 A10 10 0 0 0 10 -2.2" fill="none" stroke="#f6e9c9" strokeWidth="1" strokeDasharray="1.8 1.6" opacity="0.8" />
            <circle cx="-3.2" cy="-3.6" r="2.6" fill="#fff" opacity="0.35" />
          </motion.g>

          {/* Six: spark burst */}
          {kind === 'six' && playing && (
            <motion.g initial={{ opacity: 0 }} {...act(delivery.burst)}>
              {SPARKS.map((s, i) => (
                <motion.line
                  key={i}
                  x1={600}
                  y1={88}
                  x2={600 + s.dx * 0.35}
                  y2={88 + s.dy * 0.35}
                  stroke={i % 2 ? 'rgb(var(--glow))' : '#fbbf24'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ x: 0, y: 0 }}
                  animate={{ x: [0, 0, s.dx], y: [0, 0, s.dy] }}
                  transition={{ duration: delivery.duration, times: [0, 0.65, 0.84], ease: 'easeOut' }}
                />
              ))}
            </motion.g>
          )}

          {/* The call */}
          {playing && (
            <motion.text
              x="600"
              y={kind === 'six' ? 108 : 100}
              textAnchor="middle"
              className="t-display"
              fontSize={kind === 'six' ? 64 : 44}
              fill={kind === 'six' ? '#fbbf24' : 'rgb(var(--ball))'}
              stroke={kind === 'six' ? 'rgb(var(--bg-2))' : 'none'}
              strokeWidth="3"
              paintOrder="stroke"
              style={{ originX: 0.5, originY: 0.5 }}
              initial={{ opacity: 0 }}
              {...act(delivery.call)}
            >
              {kind === 'six' ? 'Six!' : 'Bowled!'}
            </motion.text>
          )}
        </g>

        {/* Bowler's-end stumps (near, out of focus) */}
        <g fill="rgb(var(--ink) / 0.35)">
          <rect x="580" y="352" width="7" height="68" rx="2" />
          <rect x="597" y="352" width="7" height="68" rx="2" />
          <rect x="614" y="352" width="7" height="68" rx="2" />
        </g>
      </svg>
    </div>
  );
}
