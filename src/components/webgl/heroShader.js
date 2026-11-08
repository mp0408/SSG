/**
 * Hero ball shader: a stitched cricket ball with a holographic rim. It runs only
 * over the small canvas around the ball, not the whole screen, so it stays cheap on phones.
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
uniform float uScale;   // intro pop, 1 at rest
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

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

void main() {
  // The canvas is 1.5 ball-diameters wide, so the radius is a third of its width.
  float radius = uResolution.x / 3.0 * max(uScale, 0.001);
  vec2 q = (gl_FragCoord.xy - uResolution * 0.5) / radius;
  float r = length(q);
  float px = 1.0 / radius;

  // Atmosphere: soft plasma halo outside the sphere, fading out before the canvas edge.
  float edge = 1.48 / max(uScale, 0.001);
  float halo = exp(-max(r - 1.0, 0.0) * 5.5) * (1.0 - smoothstep(edge * 0.72, edge, r)) * 0.55;
  vec4 outside = vec4(vec3(0.18, 0.78, 1.0) * halo, halo);

  float cover = 1.0 - smoothstep(1.0 - px * 1.5, 1.0, r);
  if (cover <= 0.0) {
    gl_FragColor = outside;
    return;
  }

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

  float grain = noise(vec2(lon, lat) * 40.0) * 0.12;
  vec3 leather = vec3(0.62, 0.045, 0.075) * (0.9 + grain);
  vec3 color = mix(leather, leather * 0.42, groove);
  color = mix(color, leather * 0.7, quarter * 0.7);
  color = mix(color, vec3(0.97, 0.93, 0.84), stitch * 0.95);

  vec3 key = normalize(vec3(-0.55, 0.75, 0.6));
  vec3 fill = normalize(vec3(0.8, 0.35, 0.45));
  vec3 view = vec3(0.0, 0.0, 1.0);
  float gloss = 1.0 - stitch * 0.8;
  float spec = pow(max(dot(reflect(-key, n), view), 0.0), 42.0) * 0.85 * gloss
             + pow(max(dot(reflect(-fill, n), view), 0.0), 24.0) * 0.25 * gloss;
  float rim = pow(1.0 - n.z, 2.4);

  vec3 lit = color * (0.16 + max(dot(n, key), 0.0) + 0.32 * max(dot(n, fill), 0.0) * vec3(0.75, 0.85, 1.25))
           + spec * vec3(1.0, 0.96, 0.92)
           + rim * vec3(0.2, 0.75, 1.0) * 0.95;

  gl_FragColor = mix(outside, vec4(lit, 1.0), cover);
}
`;
