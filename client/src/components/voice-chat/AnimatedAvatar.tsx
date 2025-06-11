import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedAvatarProps {
  audioLevel: number;
  isSpeaking: boolean;
  isConnected: boolean;
}

// Cartoony humanoid avatar component with animated face
const Avatar: React.FC<{ audioLevel: number; isSpeaking: boolean; isConnected: boolean }> = ({
  audioLevel,
  isSpeaking,
  isConnected,
}) => {
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Head movement based on audio level
    if (headRef.current) {
      const headScale = 1 + (audioLevel / 255) * 0.1;
      headRef.current.scale.setScalar(headScale);

      // Subtle head bobbing when speaking
      if (isSpeaking) {
        headRef.current.position.y = 1.2 + Math.sin(time * 4) * 0.05;
      } else {
        headRef.current.position.y = 1.2;
      }
    }

    // Mouth animation when speaking
    if (mouthRef.current) {
      if (isSpeaking) {
        // Open and close mouth based on audio level and time
        const mouthScale = 1 + (audioLevel / 255) * 0.5 + Math.sin(time * 8) * 0.3;
        mouthRef.current.scale.y = Math.max(0.3, mouthScale);
        mouthRef.current.scale.x = 1 + Math.sin(time * 6) * 0.2;
      } else {
        // Closed mouth
        mouthRef.current.scale.y = 0.3;
        mouthRef.current.scale.x = 1;
      }
    }

    // Eye blinking animation
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkTime = Math.sin(time * 0.8) > 0.95 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blinkTime;
      rightEyeRef.current.scale.y = blinkTime;
    }

    // Arm movement when speaking
    if (leftArmRef.current && rightArmRef.current) {
      if (isSpeaking) {
        leftArmRef.current.rotation.z = Math.sin(time * 3) * 0.3;
        rightArmRef.current.rotation.z = -Math.sin(time * 3) * 0.3;
      } else {
        leftArmRef.current.rotation.z = 0.3;
        rightArmRef.current.rotation.z = -0.3;
      }
    }

    // Overall gentle floating animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;

      // Rotation based on audio level
      const rotationIntensity = (audioLevel / 255) * 0.1;
      groupRef.current.rotation.y = Math.sin(time * 0.8) * rotationIntensity;
    }
  });

  // Bright cartoony colors based on connection and speaking state
  const headColor = isSpeaking ? '#22c55e' : isConnected ? '#3b82f6' : '#6b7280';
  const bodyColor = isSpeaking ? '#06b6d4' : isConnected ? '#a855f7' : '#4b5563';

  return (
    <group ref={groupRef}>
      {/* Head */}
      <Sphere ref={headRef} args={[0.45, 16, 16]} position={[0, 1.2, 0]}>
        <meshStandardMaterial
          color={headColor}
          emissive={isSpeaking ? '#064e3b' : '#000000'}
          emissiveIntensity={isSpeaking ? 0.2 : 0}
        />
      </Sphere>

      {/* Eyes */}
      <Sphere ref={leftEyeRef} args={[0.08, 8, 8]} position={[-0.15, 1.3, 0.35]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere ref={rightEyeRef} args={[0.08, 8, 8]} position={[0.15, 1.3, 0.35]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Eye highlights */}
      <Sphere args={[0.03, 6, 6]} position={[-0.13, 1.32, 0.4]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.03, 6, 6]} position={[0.17, 1.32, 0.4]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>

      {/* Nose */}
      <Box args={[0.04, 0.04, 0.08]} position={[0, 1.2, 0.4]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>

      {/* Mouth */}
      <Box ref={mouthRef} args={[0.15, 0.05, 0.08]} position={[0, 1.08, 0.38]}>
        <meshStandardMaterial
          color={isSpeaking ? '#dc2626' : '#7f1d1d'}
          emissive={isSpeaking ? '#450a0a' : '#000000'}
          emissiveIntensity={isSpeaking ? 0.3 : 0}
        />
      </Box>

      {/* Body */}
      <Box args={[0.7, 1.1, 0.35]} position={[0, 0.3, 0]}>
        <meshStandardMaterial
          color={bodyColor}
          emissive={isSpeaking ? '#1e293b' : '#000000'}
          emissiveIntensity={isSpeaking ? 0.1 : 0}
        />
      </Box>

      {/* Left Arm */}
      <Cylinder
        ref={leftArmRef}
        args={[0.08, 0.08, 0.7]}
        position={[-0.45, 0.5, 0]}
        rotation={[0, 0, 0.3]}
      >
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>

      {/* Right Arm */}
      <Cylinder
        ref={rightArmRef}
        args={[0.08, 0.08, 0.7]}
        position={[0.45, 0.5, 0]}
        rotation={[0, 0, -0.3]}
      >
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>

      {/* Left Leg */}
      <Cylinder args={[0.1, 0.1, 0.8]} position={[-0.2, -0.6, 0]}>
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>

      {/* Right Leg */}
      <Cylinder args={[0.1, 0.1, 0.8]} position={[0.2, -0.6, 0]}>
        <meshStandardMaterial color={bodyColor} />
      </Cylinder>
    </group>
  );
};

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ audioLevel, isSpeaking, isConnected }) => {
  return (
    <div className="flex items-center justify-center mb-8 h-64 w-64">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[2, 2, 2]} intensity={1} />
        <pointLight position={[-2, -2, -2]} intensity={0.5} color="#60a5fa" />

        {/* Avatar */}
        <Avatar audioLevel={audioLevel} isSpeaking={isSpeaking} isConnected={isConnected} />
      </Canvas>
    </div>
  );
};

export default AnimatedAvatar;
