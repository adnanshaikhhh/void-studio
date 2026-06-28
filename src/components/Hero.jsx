import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { useThree } from '@react-three/fiber';

// We'll create a custom hook for the mouse position
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position to -1 to 1
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        z: 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return mouse;
}

export function Hero() {
  const { scene, camera } = useThree();
  const mouse = useMousePosition();
  const ref = useRef(null);

  // We'll manage our own particle system for the hero
  useEffect(() => {
    const { scene, particles } = createParticleSystem(8000);
    scene.add(mesh);

    return () => {
      scene.remove(mesh);
    };
  }, [scene]);

  // We'll use the useFrame hook to update the particle system
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    particles.forEach(p => p.update(time, mouse));
    // Update the geometry attributes
    const positions = mesh.geometry.attributes.position;
    const colors = mesh.geometry.attributes.color;
    const sizes = mesh.geometry.attributes.size;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      positions.setXYZ(i, p.position.x, p.position.y, p.position.z);
      colors.setXYZ(i, p.color.r, p.color.g, p.color.b);
      // Size can be animated with sine wave for twinkle
      sizes.setX(i, p.size + Math.sin(time * 2 + i) * 0.5);
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    sizes.needsUpdate = true;
  });

  // We'll create the text and button here using HTML/CSS overlay
  return (
    <>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <h1 className="text-6xl md:text-9xl font-bold leading-tight tracking-wider text-white">
          <span className="relative inline-block">
            V
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent animate-glow">
              O
            </span>
            I
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent animate-glow delay-100">
              D
            </span>
          </span>
          <span className="relative inline-block ml-2">
            S
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent animate-glow delay-200">
              T
            </span>
            U
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent animate-glow delay-300">
              D
            </span>
            I
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent animate-glow delay-400">
              O
            </span>
          </span>
        </h1>
        <button
          className="mt-8 px-8 py-4 bg-violet-500/20 backdrop-blur-sm border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 hover:text-violet-100 transition-all duration-300 relative overflow-hidden"
          ref={ref}
        >
          Explore Work
          <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
        </button>
        <div className="mt-6 flex space-x-4">
          <button
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            id="audio-toggle"
            aria-label="Toggle ambient sound"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.59 16.34l1.41-1.41a5.5 5.5 0 11-4.24 4.24l-1.42-1.42A11.03 11.03 0 0112 15c4.27 0 7.77-2.93 9.66-7zM16 11a5 5 0 11-10 0 5 5 0 0110 0z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// We'll create a simple particle system for the hero
function createParticleSystem(count) {
  // We'll reuse the same particle system from scene.js but we can create a simpler one here for the background
  // However, to avoid duplication, we'll use the same createParticleSystem function from scene.js
  // But note: we are already using useThree and we don't want to create two scenes.
  // Instead, we'll use the same scene from useThree and add our own particle system to it.
  // We'll create a new set of particles and add them to the scene.

  // Since we are already using useThree, we can create a new set of particles and add them to the scene.
  // We'll do it in the useEffect above.

  // For simplicity, we'll create a helper function that returns the same as in scene.js but without creating a new scene.
  // Let's create a function that just returns the particles and the mesh for a given count.

  // We'll copy the logic from scene.js but without the scene creation.

  // However, to avoid duplication, we'll import the createParticleSystem from lib/scene and use it.
  // But note: we are in a component and we don't want to import a function that creates a scene.
  // Let's adjust: we'll create a helper function in lib/particles.js.

  // Given the time, we'll create a simple particle system here for the hero.

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const particles = [];
  for (let i = 0; i < count; i++) {
    // We'll create a particle object similar to the one in scene.js
    const p = {
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      color: new THREE.Color(0xffffff),
      size: Math.random() * 2 + 0.5,
    };

    // Initialize particle in a cylindrical/tunnel shape
    const radius = 5 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 200; // height of tunnel

    p.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );

    // Velocity: move towards negative Z (into the tunnel) and slightly outward/inward
    p.velocity.set(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      -Math.random() * 0.5 - 0.2
    );

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

  const mesh = new THREE.Points(geometry, material);

  return { mesh, particles };
}