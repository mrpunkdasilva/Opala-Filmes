'use client';

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

function makePRNG(seed) {
  let s = seed ? seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) : Math.floor(Math.random() * 10000);
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function GemMesh({ seed }) {
  const prng = useMemo(() => makePRNG(seed), [seed]);

  const geometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1, 0);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const scale = 0.9 + prng() * 0.3;
      v.multiplyScalar(scale);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }, [prng]);

  const color = '#0BDB72';

  return (
    <mesh geometry={geometry} rotation={[0.6, 0.8, 0]}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.05}
        metalness={0.9}
        transmission={0.6}
        ior={1.4}
        thickness={0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={2}
      />
    </mesh>
  );
}

export function GemScene({ seed }) {
  const gemId = useMemo(() => {
    if (!seed) return '0x0000000000000000';
    const prng = makePRNG(seed + '-id'); // use a different seed for id
    let id = '0x';
    for (let i = 0; i < 16; i++) {
      id += Math.floor(prng() * 16).toString(16);
    }
    return id.toUpperCase();
  }, [seed]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          boxShadow: "0 0 15px rgba(11, 219, 114, 0.4)",
          background: "radial-gradient(circle at center, #000010, #000)",
        }}
      >
        <Canvas camera={{ position: [0.5, 0.5, 2] }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} color="#00ffff" intensity={2.5} />
          <pointLight position={[-3, -3, -3]} color="#ff00ff" intensity={1.5} />
          <Environment preset="city" />
          <GemMesh seed={seed} />
          <OrbitControls autoRotate enableZoom={false} />
        </Canvas>
      </div>
      <div style={{
        color: '#0BDB72',
        fontFamily: 'var(--font-orbitron), monospace',
        fontSize: '14px',
        textShadow: '0 0 8px rgba(11, 219, 114, 0.7)',
        letterSpacing: '1px'
      }}>
        {gemId}
      </div>
    </div>
  );
}
