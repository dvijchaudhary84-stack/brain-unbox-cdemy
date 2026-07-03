import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 1. High-fidelity smooth swallow bird with customizable biology color codes
function CanopyBird({ position, scale = 1, speed = 3, orbitRadius = 4, direction = 1, verticalOffset = 0, bodyColor = '#39e365', wingColor = '#1db845', tailColor = '#1db845' }) {
  const birdRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const time = elapsed * speed + offset;

    if (birdRef.current) {
      // Orbit flight path wrapping around forest canopy
      const angle = (elapsed * 0.3 * direction) + offset;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = position[1] + Math.sin(elapsed * 1.5 + offset) * 0.4 + verticalOffset;
      
      birdRef.current.position.set(x, y, z);

      // Facing tangent path
      const nextAngle = ((elapsed + 0.01) * 0.3 * direction) + offset;
      const nextX = Math.cos(nextAngle) * orbitRadius;
      const nextZ = Math.sin(nextAngle) * orbitRadius;
      const rotY = Math.atan2(nextX - x, nextZ - z) + (direction > 0 ? Math.PI / 2 : -Math.PI / 2);
      birdRef.current.rotation.y = rotY;
      
      // Banking tilt
      birdRef.current.rotation.z = Math.sin(elapsed * 1.5) * 0.2 * direction;
    }

    // Wing flapping
    const flap = Math.sin(time * 5.5) * 0.75;
    if (leftWingRef.current) leftWingRef.current.rotation.z = -flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = flap;
  });

  return (
    <group ref={birdRef} scale={[scale * 0.14, scale * 0.14, scale * 0.14]}>
      {/* Swallow Streamlined Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} scale={[1, 1, 2.4]} />
        <meshPhysicalMaterial 
          color={bodyColor} 
          roughness={0.15} 
          metalness={0.1}
          clearcoat={0.8}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.2, 0.85]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={0.8} />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 0.15, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.28, 16]} />
        <meshBasicMaterial color="#ffc107" />
      </mesh>

      {/* Smooth swallow tail fork */}
      <group position={[0, -0.05, -1.35]} rotation={[0.2, 0, 0]}>
        <mesh position={[-0.15, 0, -0.4]} rotation={[0, -0.15, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 8]} scale={[0.8, 0.1, 4.0]} />
          <meshPhysicalMaterial color={tailColor} roughness={0.2} />
        </mesh>
        <mesh position={[0.15, 0, -0.4]} rotation={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 8]} scale={[0.8, 0.1, 4.0]} />
          <meshPhysicalMaterial color={tailColor} roughness={0.2} />
        </mesh>
      </group>

      {/* Curved Aerofoil Wings */}
      <group position={[-0.45, 0, 0.1]} ref={leftWingRef}>
        <mesh position={[-0.9, 0, 0.1]} rotation={[0, -0.1, -0.1]} castShadow>
          <sphereGeometry args={[0.9, 32, 8]} scale={[1, 0.04, 0.35]} />
          <meshPhysicalMaterial color={wingColor} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.45, 0, 0.1]} ref={rightWingRef}>
        <mesh position={[0.9, 0, 0.1]} rotation={[0, 0.1, 0.1]} castShadow>
          <sphereGeometry args={[0.9, 32, 8]} scale={[1, 0.04, 0.35]} />
          <meshPhysicalMaterial color={wingColor} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// 2. Perched Bird sitting on tree branches, looking around dynamically
function PerchedBird({ position, rotation = [0, 0, 0], scale = 1, bodyColor = '#ef4444', wingColor = '#b91c1c' }) {
  const headRef = useRef();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (headRef.current) {
      if (Math.sin(elapsed * 1.5 + phase) > 0.7) {
        headRef.current.rotation.y = Math.sin(elapsed * 5 + phase) * 0.5;
        headRef.current.rotation.x = Math.cos(elapsed * 4) * 0.15;
      }
    }
  });

  return (
    <group position={position} rotation={rotation} scale={[scale * 0.11, scale * 0.11, scale * 0.11]}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} scale={[1, 1, 1.8]} />
        <meshPhysicalMaterial color={bodyColor} roughness={0.2} clearcoat={0.6} />
      </mesh>
      {/* Head */}
      <group ref={headRef} position={[0, 0.35, 0.55]}>
        <mesh castShadow>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.06, 0.22, 16]} />
          <meshBasicMaterial color="#ffc107" />
        </mesh>
      </group>
      {/* Wings folded */}
      <mesh position={[-0.45, 0.1, -0.1]} rotation={[0.1, 0, 0.1]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} scale={[0.4, 0.8, 1.4]} />
        <meshPhysicalMaterial color={wingColor} roughness={0.2} />
      </mesh>
      <mesh position={[0.45, 0.1, -0.1]} rotation={[0.1, 0, -0.1]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} scale={[0.4, 0.8, 1.4]} />
        <meshPhysicalMaterial color={wingColor} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 3. Fluttering Butterfly component closer to flowers/tree roots
function CanopyButterfly({ position, scale = 1, speed = 2, orbitRadius = 2.2, wingColor = '#ff6a00', direction = 1, verticalOffset = 0 }) {
  const butterflyRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (butterflyRef.current) {
      const angle = (elapsed * 0.45 * direction) + offset;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = position[1] + Math.sin(elapsed * 4.5 + offset) * 0.3 + verticalOffset;
      butterflyRef.current.position.set(x, y, z);

      const nextAngle = ((elapsed + 0.01) * 0.45 * direction) + offset;
      const nextX = Math.cos(nextAngle) * orbitRadius;
      const nextZ = Math.sin(nextAngle) * orbitRadius;
      butterflyRef.current.rotation.y = Math.atan2(nextX - x, nextZ - z) + (direction > 0 ? Math.PI / 2 : -Math.PI / 2);
    }

    const flap = Math.sin(elapsed * 28 + offset) * 0.85;
    if (leftWingRef.current) leftWingRef.current.rotation.y = -flap;
    if (rightWingRef.current) rightWingRef.current.rotation.y = flap;
  });

  return (
    <group ref={butterflyRef} scale={[scale * 0.08, scale * 0.08, scale * 0.08]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.07, 0.38, 8, 16]} />
        <meshBasicMaterial color="#140e0a" />
      </mesh>
      
      <group ref={leftWingRef} position={[-0.04, 0, 0]}>
        <mesh position={[-0.32, 0.1, 0]} rotation={[0, 0, 0.25]} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} scale={[1, 0.02, 1.35]} />
          <meshPhysicalMaterial 
            color={wingColor} 
            roughness={0.2} 
            transparent 
            opacity={0.88}
            transmission={0.3}
          />
        </mesh>
      </group>

      <group ref={rightWingRef} position={[0.04, 0, 0]}>
        <mesh position={[0.32, 0.1, 0]} rotation={[0, 0, -0.25]} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} scale={[1, 0.02, 1.35]} />
          <meshPhysicalMaterial 
            color={wingColor} 
            roughness={0.2} 
            transparent 
            opacity={0.88}
            transmission={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

// 4. Ultra High-Performance Heavy Grass Carpet (65,000 blades initialized statically for zero CPU overhead)
function InstancedGrassCarpet({ count = 65000, isMobile = false }) {
  const meshRef = useRef();

  useMemo(() => {
    const tempObject = new THREE.Object3D();
    
    // Defer initialization slightly to ensure canvas mount
    setTimeout(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Super dense forest carpet spanning 13.5m radius
        const radius = Math.sqrt(Math.random()) * 13.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = -2.50;

        const scaleY = 0.4 + Math.random() * 0.75;
        const scaleXZ = 0.5 + Math.random() * 0.5;
        const rotX = (Math.random() - 0.5) * 0.28;
        const rotY = Math.random() * Math.PI;
        const rotZ = (Math.random() - 0.5) * 0.28;

        tempObject.position.set(x, y + (scaleY * 0.15), z);
        tempObject.rotation.set(rotX, rotY, rotZ);
        tempObject.scale.set(scaleXZ * 0.02, scaleY * 0.42, scaleXZ * 0.02);
        tempObject.updateMatrix();

        mesh.setMatrixAt(i, tempObject.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }, 50);
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow={!isMobile} receiveShadow={!isMobile}>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial 
        color="#156e21" 
        roughness={0.98} 
      />
    </instancedMesh>
  );
}

// 5. Stylized Grazing Fawn (Deer) - Classic Wildlife discovery channel centerpiece
function JungleDeer({ position, scale = 0.85 }) {
  const neckRef = useRef();
  const tailRef = useRef();
  const deerRef = useRef();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (neckRef.current) {
      neckRef.current.rotation.x = 0.5 + Math.sin(elapsed * 0.7) * 0.25;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(elapsed * 4) * 0.2;
    }
    if (deerRef.current) {
      deerRef.current.scale.set(scale, scale + Math.sin(elapsed * 2) * 0.008, scale);
    }
  });

  return (
    <group ref={deerRef} position={position} scale={[scale, scale, scale]} rotation={[0, 0.4, 0]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.35, 32, 16]} scale={[1, 1, 2.0]} />
        <meshStandardMaterial color="#b27a51" roughness={0.8} />
      </mesh>
      <mesh position={[-0.15, -0.6, 0.45]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.8, 12]} />
        <meshStandardMaterial color="#b27a51" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, -0.6, 0.45]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.8, 12]} />
        <meshStandardMaterial color="#b27a51" roughness={0.8} />
      </mesh>
      <mesh position={[-0.15, -0.6, -0.45]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.8, 12]} />
        <meshStandardMaterial color="#b27a51" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, -0.6, -0.45]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.8, 12]} />
        <meshStandardMaterial color="#b27a51" roughness={0.8} />
      </mesh>
      <group ref={neckRef} position={[0, 0.15, 0.6]} rotation={[0.4, 0, 0]}>
        <mesh position={[0, 0.25, 0.15]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.11, 0.6, 12]} />
          <meshStandardMaterial color="#b27a51" roughness={0.8} />
        </mesh>
        <group position={[0, 0.55, 0.25]} rotation={[-0.4, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.14, 16, 16]} scale={[1, 1, 1.6]} />
            <meshStandardMaterial color="#a06b44" roughness={0.8} />
          </mesh>
          <mesh position={[-0.12, 0.08, -0.05]} rotation={[0.2, 0, -0.4]}>
            <coneGeometry args={[0.03, 0.14, 8]} />
            <meshStandardMaterial color="#b27a51" />
          </mesh>
          <mesh position={[0.12, 0.08, -0.05]} rotation={[0.2, 0, 0.4]}>
            <coneGeometry args={[0.03, 0.14, 8]} />
            <meshStandardMaterial color="#b27a51" />
          </mesh>
        </group>
      </group>
      <group ref={tailRef} position={[0, 0.2, -0.65]} rotation={[-0.4, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.06, 8, 8]} scale={[1, 1, 2.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// 6. Styled Lizard creeping on the Tree Trunk
function JungleLizard({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const lizardRef = useRef();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (lizardRef.current) {
      lizardRef.current.position.y = position[1] + Math.sin(elapsed * 0.6) * 0.35;
      lizardRef.current.rotation.z = Math.sin(elapsed * 3) * 0.08;
    }
  });

  return (
    <group ref={lizardRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <sphereGeometry args={[0.12, 16, 16]} scale={[0.5, 2.2, 0.5]} />
        <meshPhysicalMaterial color="#32cd32" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.3, 0.02]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} scale={[1, 1.2, 0.8]} />
        <meshPhysicalMaterial color="#228b22" roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.4, -0.02]} rotation={[0.1, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.015, 0.04, 0.6, 8]} />
        <meshPhysicalMaterial color="#32cd32" roughness={0.3} />
      </mesh>
    </group>
  );
}

// 7. Bioluminescent Mushrooms growing in colonies near Tree Roots
function GlowingMushrooms({ position, color = '#ff00ff', emissive = '#ff00aa', scale = 1.0 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <group position={[0, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.025, 0.28, 8]} />
          <meshStandardMaterial color="#fff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} scale={[1, 0.7, 1]} />
          <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={2.5} roughness={0.1} />
        </mesh>
      </group>
      <group position={[0.12, -0.03, 0.08]} rotation={[0.2, 0, -0.2]} scale={[0.7, 0.7, 0.7]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.025, 0.28, 8]} />
          <meshStandardMaterial color="#fff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} scale={[1, 0.7, 1]} />
          <meshPhysicalMaterial color="#00ffff" emissive="#00bfff" emissiveIntensity={2.5} roughness={0.1} />
        </mesh>
      </group>
      <group position={[-0.08, -0.02, -0.1]} rotation={[-0.15, 0, 0.25]} scale={[0.8, 0.8, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.025, 0.28, 8]} />
          <meshStandardMaterial color="#fff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} scale={[1, 0.7, 1]} />
          <meshPhysicalMaterial color="#ffff00" emissive="#ffd700" emissiveIntensity={2.2} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// 8. High-fidelity smooth organic Jungle Tree
function JungleTree({ position, height = 3.5, scale = 1, baseRadius = 0.18 }) {
  const leafClusters = useMemo(() => {
    return [
      { pos: [0, height + 0.3, 0], radius: 1.1 * scale, color: '#135c24' },
      { pos: [-0.6 * scale, height, 0.4 * scale], radius: 0.8 * scale, color: '#1a7531' },
      { pos: [0.5 * scale, height + 0.15, -0.5 * scale], radius: 0.85 * scale, color: '#2da84a' },
      { pos: [0.2 * scale, height - 0.2, 0.6 * scale], radius: 0.7 * scale, color: '#39e365' },
      { pos: [-0.4 * scale, height + 0.2, -0.6 * scale], radius: 0.75 * scale, color: '#1a7531' }
    ];
  }, [height, scale]);

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[baseRadius * 0.6, baseRadius, height, 32]} />
        <meshStandardMaterial color="#5c4533" roughness={0.9} metalness={0.0} />
      </mesh>
      {leafClusters.map((cluster, i) => (
        <mesh key={i} position={cluster.pos} castShadow>
          <sphereGeometry args={[cluster.radius, 32, 32]} />
          <meshPhysicalMaterial color={cluster.color} roughness={0.8} transparent opacity={0.95} transmission={0.15} />
        </mesh>
      ))}
    </group>
  );
}

// 9. Spores acting as fireflies / pollen floating in the jungle air
function Fireflies({ count = 350 }) {
  const pointsRef = useRef();

  const data = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 10 - 4,
        z: (Math.random() - 0.5) * 20,
        speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }
    return list;
  }, [count]);

  const posArray = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array;
    const elapsed = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const f = data[i];
      f.y += 0.008;
      f.phase += 0.02;

      const currentX = f.x + Math.sin(f.phase + elapsed) * 0.35;
      const currentZ = f.z + Math.cos(f.phase * 0.7 + elapsed) * 0.35;

      if (f.y > 6) {
        f.y = -4;
        f.x = (Math.random() - 0.5) * 20;
        f.z = (Math.random() - 0.5) * 20;
      }

      array[i * 3] = currentX;
      array[i * 3 + 1] = f.y;
      array[i * 3 + 2] = currentZ;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArray, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#39e365" size={0.07} sizeAttenuation transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Main 3D Lively Jungle Environment
export default function NatureScene() {
  const { camera } = useThree();
  const forestRef = useRef();
  const lightRef = useRef();

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      const mobileWidth = window.innerWidth <= 768;
      const touchDevice = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobileWidth || touchDevice);
    };

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Dense Jungle Tree layout (increased to 42 trees on desktop, reduced to 12 on mobile for memory safety)
  const trees = useMemo(() => {
    const list = [];
    const count = isMobile ? 12 : 42;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4);
      const radius = 3.6 + Math.random() * 7.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = 2.6 + Math.random() * 2.8;
      const scale = 0.7 + Math.random() * 0.7;
      list.push({ x, z, height, scale });
    }
    return list;
  }, [isMobile]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (forestRef.current) {
      forestRef.current.rotation.y = Math.sin(elapsed * 0.02) * 0.02;
    }

    const target = window.__natureTarget || { x: 0, y: 0, z: 5, rx: 0, ry: 0 };
    camera.position.x += (target.x - camera.position.x) * 0.05;
    camera.position.y += (target.y - camera.position.y) * 0.05;
    camera.position.z += (target.z - camera.position.z) * 0.05;
    camera.rotation.x += (target.rx - camera.rotation.x) * 0.05;
    camera.rotation.y += (target.ry - camera.rotation.y) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.7} color="#15421d" />
      
      <directionalLight 
        ref={lightRef}
        position={[12, 16, 6]} 
        intensity={3.4} 
        color="#fff4d9" 
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
        shadow-bias={-0.0005}
      />

      <pointLight position={[0, -0.6, 1.2]} intensity={2.2} color="#00ff66" distance={6} />
      <pointLight position={[-4, 2, -3]} intensity={1.5} color="#39e365" distance={10} />
      <pointLight position={[4, 1.5, -2]} intensity={1.5} color="#39e365" distance={10} />

      <Fireflies key={isMobile ? 'mobile' : 'desktop'} count={isMobile ? 100 : 400} />

      {/* Orbiting Multi-colored Swallow Birds */}
      <CanopyBird position={[0, 1.8, 0]} scale={1.2} speed={4.5} orbitRadius={4.5} direction={1} verticalOffset={0.5} bodyColor="#39e365" wingColor="#1db845" tailColor="#1db845" />
      {!isMobile && (
        <>
          <CanopyBird position={[0, -0.2, 0]} scale={0.95} speed={3.5} orbitRadius={3.8} direction={-1} verticalOffset={-0.2} bodyColor="#00d4ff" wingColor="#005b96" tailColor="#003b6f" />
          <CanopyBird position={[0, 0.8, 0]} scale={1.1} speed={4.0} orbitRadius={5.2} direction={1} verticalOffset={0.2} bodyColor="#ff9e00" wingColor="#d97706" tailColor="#b45309" />
          <CanopyBird position={[0, 2.4, 0]} scale={1.0} speed={4.8} orbitRadius={4.8} direction={-1} verticalOffset={1.0} bodyColor="#ef4444" wingColor="#b91c1c" tailColor="#991b1b" />
        </>
      )}
      <CanopyBird position={[0, -1.0, 0]} scale={0.9} speed={3.8} orbitRadius={4.2} direction={1} verticalOffset={-0.7} bodyColor="#ff007f" wingColor="#b5006b" tailColor="#8a0052" />

      {/* Orbiting Butterflies */}
      <CanopyButterfly position={[0, -1.5, 0]} scale={1.1} speed={2.8} orbitRadius={2.0} wingColor="#ff6b00" direction={1} verticalOffset={-0.5} />
      {!isMobile && (
        <>
          <CanopyButterfly position={[0, -1.0, 0]} scale={1.0} speed={2.2} orbitRadius={2.5} wingColor="#8b5cf6" direction={-1} verticalOffset={-0.1} />
          <CanopyButterfly position={[0, -0.6, 0]} scale={0.9} speed={2.5} orbitRadius={1.8} wingColor="#06b6d4" direction={1} verticalOffset={0.2} />
        </>
      )}

      <group ref={forestRef}>
        
        {/* Ground plane */}
        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!isMobile}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#051708" 
            roughness={0.98} 
            metalness={0.0} 
          />
        </mesh>

        {/* Instanced Blades representing a dense photorealistic mossy lawn carpet (reduced on mobile for smooth performance) */}
        <InstancedGrassCarpet key={isMobile ? 'mobile' : 'desktop'} count={isMobile ? 3500 : 65000} isMobile={isMobile} />

        {/* Scattered Jungle Trees */}
        {trees.map((t, idx) => (
          <JungleTree 
            key={idx} 
            position={[t.x, -2.5, t.z]} 
            height={t.height} 
            scale={t.scale} 
          />
        ))}

        {/* Bioluminescent Glowing Mushrooms */}
        <GlowingMushrooms position={[-0.8, -2.5, 1.4]} color="#ff00ff" emissive="#ff00aa" scale={1.0} />
        <GlowingMushrooms position={[0.7, -2.5, 0.7]} color="#00ffff" emissive="#0088cc" scale={0.8} />
        <GlowingMushrooms position={[1.4, -2.5, -0.8]} color="#ffff00" emissive="#ffd700" scale={0.9} />

        {/* Grazing Fawn */}
        <JungleDeer position={[1.5, -2.5, -0.3]} scale={0.9} />

        {/* THE CENTRAL CANOPY TREE */}
        <group position={[0, -2.5, 0]}>
          
          <mesh position={[0, 1.5, 0]} castShadow={!isMobile} receiveShadow={!isMobile}>
            <cylinderGeometry args={[0.15, 0.35, 3.0, 32]} />
            <meshStandardMaterial color="#4d3b2b" roughness={0.9} />
          </mesh>

          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh 
                key={i} 
                position={[Math.cos(angle) * 0.4, 0.05, Math.sin(angle) * 0.4]} 
                rotation={[0.3, -angle, 0]}
                castShadow={!isMobile}
              >
                <cylinderGeometry args={[0.08, 0.18, 0.8, 16]} />
                <meshStandardMaterial color="#4d3b2b" roughness={0.9} />
              </mesh>
            );
          })}

          <mesh position={[-0.35, 3.1, 0.25]} rotation={[0, 0, -0.45]} castShadow={!isMobile}>
            <cylinderGeometry args={[0.08, 0.15, 1.2, 24]} />
            <meshStandardMaterial color="#4d3b2b" roughness={0.9} />
          </mesh>
          <mesh position={[0.35, 3.2, -0.2]} rotation={[0, 0, 0.45]} castShadow={!isMobile}>
            <cylinderGeometry args={[0.07, 0.14, 1.3, 24]} />
            <meshStandardMaterial color="#4d3b2b" roughness={0.9} />
          </mesh>

          {/* Perched birds */}
          <PerchedBird position={[-0.7, 3.3, 0.4]} rotation={[0, 1.2, 0]} scale={1.1} bodyColor="#ef4444" wingColor="#b91c1c" />
          <PerchedBird position={[0.8, 3.4, -0.3]} rotation={[0, -0.8, 0]} scale={0.95} bodyColor="#00d4ff" wingColor="#005b96" />

          {/* Climbing Lizard */}
          <JungleLizard position={[0.18, 1.6, 0.1]} rotation={[0, -0.2, 0]} scale={0.45} />

          <mesh position={[0, 3.8, 0]} castShadow={!isMobile}>
            <sphereGeometry args={[1.6, 64, 64]} />
            <meshPhysicalMaterial color="#135c24" roughness={0.7} transparent opacity={0.95} />
          </mesh>
          <mesh position={[-1.1, 3.5, 0.7]} castShadow={!isMobile}>
            <sphereGeometry args={[1.1, 48, 48]} />
            <meshPhysicalMaterial color="#1a7531" roughness={0.7} />
          </mesh>
          <mesh position={[1.2, 3.6, -0.6]} castShadow={!isMobile}>
            <sphereGeometry args={[1.0, 48, 48]} />
            <meshPhysicalMaterial color="#2da84a" roughness={0.7} />
          </mesh>

          {/* Golden Nest */}
          <group position={[0, 0.35, 1.2]} scale={[0.8, 0.8, 0.8]}>
            {[...Array(14)].map((_, idx) => {
              const angle = (idx / 14) * Math.PI * 2;
              const rad = 0.55 + Math.sin(idx) * 0.08;
              return (
                <mesh key={idx} rotation={[Math.sin(idx)*0.22, angle, 0]} castShadow={!isMobile}>
                  <torusGeometry args={[rad, 0.032, 24, 48]} />
                  <meshStandardMaterial color="#6a533b" roughness={0.95} />
                </mesh>
              );
            })}
            
            <mesh position={[-0.12, 0.1, -0.05]} rotation={[0.3, 0.2, -0.2]} castShadow={!isMobile}>
              <sphereGeometry args={[0.13, 64, 64]} scale={[1, 1.35, 1]} />
              {isMobile ? (
                <meshStandardMaterial color="#39e365" roughness={0.3} metalness={0.1} transparent opacity={0.7} />
              ) : (
                <meshPhysicalMaterial color="#39e365" transparent opacity={0.88} transmission={0.9} thickness={0.5} ior={1.45} roughness={0.05} clearcoat={1.0} />
              )}
            </mesh>

            <mesh position={[0.12, 0.12, 0.05]} rotation={[-0.3, -0.3, 0.3]} castShadow={!isMobile}>
              <sphereGeometry args={[0.14, 64, 64]} scale={[1, 1.38, 1]} />
              {isMobile ? (
                <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} transparent opacity={0.85} />
              ) : (
                <meshPhysicalMaterial color="#ffffff" transparent opacity={0.9} transmission={0.95} thickness={0.6} ior={1.5} roughness={0.03} clearcoat={1.0} />
              )}
            </mesh>
          </group>

        </group>
      </group>
    </>
  );
}
