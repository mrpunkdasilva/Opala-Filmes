'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'

function FloatingEmoji({ position, emoji, scale = 1 }) {
  const meshRef = useRef()
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    function updatePosition() {
      const width = window.innerWidth
      let xPosition = position[0]
      let yPosition = position[1]
      let finalScale = scale
      
      if (width <= 768) { // Mobile
        xPosition *= 0.4
        yPosition *= 0.6
        finalScale *= 0.8
      } else if (width <= 1024) { // Tablet
        xPosition *= 0.6
        yPosition *= 0.8
        finalScale *= 0.9
      } else { // Desktop
        // Mantém as posições originais para telas grandes
        xPosition *= 1.2 // Aumenta um pouco para garantir que fique nos cantos
      }

      setAdjustedPosition([xPosition, yPosition, position[2]])
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [position, scale])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.position.y = adjustedPosition[1] + Math.sin(time * 0.5) * 0.3
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.1
  })

  return (
    <group ref={meshRef} position={adjustedPosition}>
      <Html transform scale={scale}>
        <div style={{ fontSize: '2em' }}>{emoji}</div>
      </Html>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[-10, 10, 5]} intensity={2} color="#0BDB72" />
      <pointLight position={[10, -10, 5]} intensity={2} color="#0BDB72" />

      {/* Emojis nos cantos */}
      <FloatingEmoji 
        position={[-18, 10, 0]} // Superior esquerdo
        emoji="🎬"
        scale={2}
      />
      <FloatingEmoji 
        position={[18, 10, 0]} // Superior direito
        emoji="🎥"
        scale={2}
      />
      <FloatingEmoji 
        position={[-18, -10, 0]} // Inferior esquerdo
        emoji="⭐"
        scale={1.5}
      />
      <FloatingEmoji 
        position={[18, -10, 0]} // Inferior direito
        emoji="🎭"
        scale={1.5}
      />
    </>
  )
}

export function Background3D() {
  const [cameraSettings, setCameraSettings] = useState({
    position: [0, 0, 20],
    fov: 75
  })

  useEffect(() => {
    function updateCamera() {
      const width = window.innerWidth
      if (width <= 768) {
        setCameraSettings({
          position: [0, 0, 15],
          fov: 90
        })
      } else if (width <= 1024) {
        setCameraSettings({
          position: [0, 0, 18],
          fov: 80
        })
      } else {
        setCameraSettings({
          position: [0, 0, 20],
          fov: 75
        })
      }
    }

    updateCamera()
    window.addEventListener('resize', updateCamera)
    return () => window.removeEventListener('resize', updateCamera)
  }, [])

  return (
    <div className="background-3d">
      <Canvas
        camera={{ 
          position: cameraSettings.position,
          fov: cameraSettings.fov,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <Scene />
        <fog attach="fog" args={['#1A1B26', 25, 45]} />
      </Canvas>
    </div>
  )
}