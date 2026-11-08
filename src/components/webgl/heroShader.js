/**
 * Hero shader: a floodlit night sky with drifting dust, three light beams
 * converging on a stitched cricket ball. Everything is analytic (no textures),
 * so it costs one full-screen triangle per frame.
 */

export const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform float uTheme;   // 0 = dark, 1 = light (animated between)
uniform vec3 uBall;     // centre xy in px (origin bottom-left), radius px
uniform vec2 uTilt;     // pointer-driven tilt, radians
uniform float uSpin;    // accumulated spin around the seam axis

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.02 + 3.1;
    amplitude *= 0.5;
  }
  return value;
}

// Soft volumetric cone travelling from origin towards target.
float beam(vec2 p, vec2 origin, vec2 target, float spread) {
  vec2 dir = normalize(target - origin);
  vec2 v = p - origin;
  float along = dot(v, dir);
  if (along <= 0.0) return 0.0;
  float perp = abs(v.x * dir.y - v.y * dir.x);
  float width = spread * along + 0.015;
  return exp(-(perp * perp) / (width * width) * 1.8) * smoothstep(0.0, 0.35, along) * exp(-along * 0.32);
}

// Sparse twinkling motes on a jittered grid — reads as dust caught in floodlight.
float motes(vec2 p, float scale, float speed, float seed) {
  p = p * scale + vec2(sin(uTime * 0.05 + seed) * 0.8, uTime * speed);
  vec2 id = floor(p);
  vec2 f = fract(p) - 0.5;
  float h = hash21(id + seed * 13.7);
  if (h > 0.42) return 0.0;
  float h2 = hash21(id + seed * 7.1 + 3.0);
  vec2 offset = vec2(h2, fract(h * 17.0)) - 0.5;
  float d = length(f - offset * 0.6);
  float radius = mix(0.025, 0.075, h2);
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + h2 * 2.2) + h * 40.0);
  return smoothstep(radius, radius * 0.2, d) * twinkle;
}

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

// Analytic sphere: leather, seam groove, six rows of stitching, gloss and rim light.
vec4 shadeBall(vec2 frag) {
  if (uBall.z < 1.0) return vec4(0.0);
  vec2 q = (frag - uBall.xy) / uBall.z;
  float r = length(q);
  float px = 1.0 / uBall.z;
  float cover = 1.0 - smoothstep(1.0 - px * 1.5, 1.0, r);
  if (cover <= 0.0) return vec4(0.0);

  vec3 n = vec3(q, sqrt(max(0.0, 1.0 - r * r)));
  vec3 b = rotY(uSpin) * rotX(0.42 + uTilt.y) * rotZ(-0.5 + uTilt.x) * n;

  float lat = asin(clamp(b.y, -1.0, 1.0));
  float lon = atan(b.z, b.x);
  float ad = abs(lat);
  float aa = px * 1.6 / max(n.z, 0.25);

  float groove = 1.0 - smoothstep(0.016, 0.016 + aa, ad);
  float rows = (1.0 - smoothstep(0.011, 0.011 + aa, abs(ad - 0.05)))
             + (1.0 - smoothstep(0.011, 0.011 + aa, abs(ad - 0.086)));
  float s = fract(lon * 9.549 + ad * 6.0);
  float dash = 1.0 - smoothstep(0.22, 0.36, abs(s - 0.5));
  float stitch = clamp(rows, 0.0, 1.0) * dash;
  float quarter = (1.0 - smoothstep(0.006, 0.006 + aa, abs(b.x))) * step(0.12, ad);

  float grain = noise(vec2(lon, lat) * 40.0) * 0.1 + noise(vec2(lon, lat) * 120.0) * 0.05;
  vec3 leather = vec3(0.6, 0.045, 0.07) * (0.9 + grain);
  vec3 color = mix(leather, leather * 0.42, groove);
  color = mix(color, leather * 0.7, quarter * 0.7);
  color = mix(color, vec3(0.97, 0.93, 0.84), stitch * 0.95);

  vec3 key = normalize(vec3(-0.55, 0.75, 0.6));
  vec3 fill = normalize(vec3(0.8, 0.35, 0.45));
  vec3 view = vec3(0.0, 0.0, 1.0);
  float gloss = 1.0 - stitch * 0.8;
  float spec = pow(max(dot(reflect(-key, n), view), 0.0), 42.0) * 0.85 * gloss
             + pow(max(dot(reflect(-fill, n), view), 0.0), 24.0) * 0.25 * gloss;
  float rim = pow(1.0 - n.z, 2.6);

  vec3 lit = color * (0.16 + max(dot(n, key), 0.0) + 0.32 * max(dot(n, fill), 0.0) * vec3(0.75, 0.85, 1.25))
           + spec * vec3(1.0, 0.96, 0.92)
           + rim * vec3(0.35, 0.6, 1.0) * mix(0.85, 0.4, uTheme);
  return vec4(lit, cover);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uResolution;
  float unit = 1.0 / uResolution.y;
  vec2 p = frag * unit;
  float aspect = uResolution.x * unit;
  vec2 ball = uBall.xy * unit;
  float ballRadius = max(uBall.z * unit, 0.04);

  vec3 night = mix(vec3(0.012, 0.02, 0.05), vec3(0.03, 0.065, 0.15), uv.y);
  vec3 day = mix(vec3(0.9, 0.925, 0.97), vec3(0.965, 0.972, 0.99), uv.y);

  float glow = exp(-length(p - ball) / (ballRadius * 2.4));
  night += vec3(0.05, 0.13, 0.4) * glow;
  day -= vec3(0.06, 0.04, 0.0) * glow;

  float sway = sin(uTime * 0.23) * 0.05;
  vec2 target = ball - vec2(0.0, ballRadius * 0.2);
  float light = beam(p, vec2(-0.25, 1.25), target + vec2(sway, 0.0), 0.11)
              + beam(p, vec2(aspect + 0.25, 1.25), target - vec2(sway * 0.8, 0.0), 0.11) * 0.8
              + beam(p, vec2(aspect * (0.5 + 0.45 * sin(uTime * 0.11)), 1.35),
                     vec2(aspect * (0.5 + 0.5 * sin(uTime * 0.11 + 1.6)), -0.3), 0.06) * 0.45;
  light *= 0.5 + 0.5 * fbm(p * 2.2 + vec2(uTime * 0.025, -uTime * 0.018));

  float dust = motes(p, 16.0, 0.035, 1.0) * 0.7 + motes(p, 28.0, 0.022, 2.0) * 0.5 + motes(p, 8.0, 0.05, 3.0);
  dust *= 0.06 + light * 1.8;

  night += vec3(0.42, 0.58, 1.0) * light * 0.55 + vec3(0.8, 0.88, 1.0) * dust;
  day = mix(day, vec3(0.62, 0.74, 1.0), clamp(light * 0.28, 0.0, 1.0));
  day -= vec3(0.3, 0.22, 0.05) * dust * 0.55;

  float shadow = length((frag - uBall.xy - vec2(0.08, -0.16) * uBall.z) / max(uBall.z, 1.0));
  day *= 1.0 - smoothstep(1.5, 0.7, shadow) * 0.16 * step(1.0, uBall.z);

  vec3 color = mix(night, day, uTheme);
  vec4 ballColor = shadeBall(frag);
  color = mix(color, ballColor.rgb, ballColor.a);

  vec2 centered = uv - 0.5;
  color *= 1.0 - dot(centered, centered) * mix(0.55, 0.12, uTheme);
  color += (hash21(frag + fract(uTime) * 91.0) - 0.5) * mix(0.03, 0.016, uTheme);

  gl_FragColor = vec4(color, 1.0);
}
`;
