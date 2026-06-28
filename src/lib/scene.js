import * as THREE from 'three';

export class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    // Initialize particle in a cylindrical/tunnel shape
    const radius = 5 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 200; // height of tunnel

    this.position = new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );

    // Velocity: move towards negative Z (into the tunnel) and slightly outward/inward
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      -Math.random() * 0.5 - 0.2
    );

    this.size = Math.random() * 2 + 0.5;
    this.color = new THREE.Color(0xffffff);
    this.color.lerp(new THREE.Color(0x7c3aed), Math.random()); // violet tint
  }

  update(time, mouse) {
    // Update position
    this.position.add(this.velocity);

    // If particle goes too far behind camera, reset it
    if (this.position.z < -100) {
      this.reset();
      return;
    }

    // Optional: add some swirl based on time and mouse
    const swirl = Math.sin(time * 0.1 + this.position.y) * 0.01;
    this.position.x += Math.cos(this.position.y + time) * swirl;
    this.position.y += Math.sin(this.position.x + time) * swirl;

    // React to mouse: attract/repel
    if (mouse) {
      const dx = this.position.x - mouse.x;
      const dy = this.position.y - mouse.y;
      const dz = this.position.z - mouse.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (distance < 50) {
        const force = (50 - distance) / 50;
        this.velocity.x += (dx / distance) * force * 0.01;
        this.velocity.y += (dy / distance) * force * 0.01;
        this.velocity.z += (dz / distance) * force * 0.01;
      }
    }
  }
}

export function createParticleSystem(count = 8000) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const particles = [];
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    particles.push(p);

    // Initial values
    positions[i * 3] = p.position.x;
    positions[i * 3 + 1] = p.position.y;
    positions[i * 3 + 2] = p.position.z;

    colors[i * 3] = p.color.r;
    colors[i * 3 + 1] = p.color.g;
    colors[i * 3 + 2] = p.color.b;

    sizes[i] = p.size;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,
    transparent: true,
    vertexColors: true,
  });

  return { mesh: new THREE.Points(geometry, material), particles };
}

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);

  const { mesh, particles } = createParticleSystem(8000);
  scene.add(mesh);

  return { scene, particles, mesh };
}