uniform float time;
uniform vec2 buttonPositions[10]; // Adjust the length as needed
uniform float audioData[10]; // Adjust the length as needed
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

// NOISE
float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 perm(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

float noise(vec3 p) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float lines(vec2 uv, float offset) {
    // Add noise to the UV coordinates to make the lines wiggly
    float noiseValue = noise(vec3(uv * 0.2, offset));
    uv.y += noiseValue * 0.2; // Adjust the scale of the noise perturbation

    return smoothstep(
        0.0, 0.5 + offset * 0.5,
        0.5 * abs((sin(uv.x * 0.3) + offset * 0.2))
    );
}

mat2 rotate2D(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
} 

void main() {
  vec3 pink = vec3(0.91,0.38,0.7);
  vec3 yellow = vec3(0.81,0.91,0.9);
  vec3 brown = vec3(0.23,0.16,0.12);
  vec3 lightGrey = vec3(1.0,1.0,1.0);
  vec3 darkGrey = vec3(0.05,0.05,0.05);
  vec3 black = vec3(0.0,0.0,0.);

  float n = noise(vPosition + time);
  vec2 baseUV = rotate2D(n) * vUv * 10.0; // Adjusted scaling factor
  float basePattern = lines(baseUV, 0.2);
  float secondPattern = lines(baseUV, 0.3);

  vec3 baseColor = mix(lightGrey, black, basePattern);
  vec3 secondBaseColor = mix(lightGrey, lightGrey, secondPattern);

  // Ripple effect
  float ripple = 0.1;
  for (int i = 0; i < 10; i++) { // Adjust the length as needed
    float dist = distance(vUv, buttonPositions[i]);
    ripple += sin(dist * 10.0 - time * 2.0) * audioData[i];
  }

  gl_FragColor = vec4(secondBaseColor * (1.0 + ripple), 1.5);
}