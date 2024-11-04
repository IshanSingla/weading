'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text as DreiText, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type RootState = {
    clock: THREE.Clock;
};

function FireAnimation() {
    const fireRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<(THREE.Mesh | null)[]>([]);

    const particles = useMemo(() => {
        return Array(50)
            .fill(null)
            .map(() => ({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    Math.random() * 0.5,
                    (Math.random() - 0.3) * 0.5
                ),
                scale: Math.random() * 0.5 + 0.5,
                speed: Math.random() * 0.2 + 0.1,
            }));
    }, []);

    useFrame((state: RootState) => {
        const t = state.clock.getElapsedTime();
        particlesRef.current.forEach((particle, i) => {
            if (particle && particles[i]) {
                particle.position.y =
                    particles[i].position.y +
                    Math.sin(t * particles[i].speed) * 0.1;
                particle.scale.setScalar(
                    particles[i].scale * (1 + Math.sin(t * 2) * 0.1)
                );
            }
        });
    });

    return (
        <group ref={fireRef} position={[0, 0, 0]}>
            {particles.map((particle, i) => (
                <mesh
                    key={i}
                    position={particle.position}
                    ref={(el) => {
                        particlesRef.current[i] = el;
                    }}
                >
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial
                        color={new THREE.Color(1, 0.5, 0).lerp(
                            new THREE.Color(1, 0, 0),
                            Math.random()
                        )}
                    />
                </mesh>
            ))}
        </group>
    );
}

function HumanCharacter({
    position,
    rotation,
    color,
    isGroom,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
    isGroom: boolean;
}) {
    return (
        <group position={position} rotation={rotation}>
            {/* Body */}
            <mesh position={[0, 0.7, 0]}>
                <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.3, 0]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color="#FFA07A" />
            </mesh>
            {/* Eyes */}
            <mesh position={[0.08, 1.35, 0.15]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[-0.08, 1.35, 0.15]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Pupils */}
            <mesh position={[0.08, 1.35, 0.18]}>
                <sphereGeometry args={[0.01, 8, 8]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.08, 1.35, 0.18]}>
                <sphereGeometry args={[0.01, 8, 8]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            {/* Mouth */}
            <mesh position={[0, 1.25, 0.18]}>
                <boxGeometry args={[0.1, 0.03, 0.01]} />
                <meshStandardMaterial color="#FF4500" />
            </mesh>
            {/* Hair */}
            <mesh position={[0, 1.45, 0]}>
                <sphereGeometry
                    args={[
                        0.21,
                        32,
                        32,
                        0,
                        Math.PI * 2,
                        0,
                        Math.PI / 2,
                    ]}
                />
                <meshStandardMaterial
                    color="#4A0404"
                    side={THREE.DoubleSide}
                />
            </mesh>
            {isGroom ? (
                // Groom's turban
                <mesh position={[0, 1.55, 0]}>
                    <torusGeometry args={[0.15, 0.1, 16, 100]} />
                    <meshStandardMaterial color="#FFD700" />
                </mesh>
            ) : (
                // Bride's veil
                <mesh
                    position={[0, 1.4, -0.1]}
                    rotation={[Math.PI / 4, 0, 0]}
                >
                    <planeGeometry args={[0.6, 0.8]} />
                    <meshStandardMaterial
                        color="#FFFAFA"
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
            {/* Arms */}
            <mesh
                position={[0.3, 0.7, 0]}
                rotation={[0, 0, -Math.PI / 4]}
            >
                <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh
                position={[-0.3, 0.7, 0]}
                rotation={[0, 0, Math.PI / 4]}
            >
                <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            <mesh position={[0.1, 0.2, 0]}>
                <capsuleGeometry args={[0.09, 0.4, 8, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.1, 0.2, 0]}>
                <capsuleGeometry args={[0.09, 0.4, 8, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
}

function BrideAndGroom() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state: RootState) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <HumanCharacter
                position={[-1, 0, 0]}
                rotation={[0, 0.2, 0]}
                color="#FF69B4"
                isGroom={false}
            />
            <HumanCharacter
                position={[1, 0, 0]}
                rotation={[0, -0.2, 0]}
                color="#4169E1"
                isGroom={true}
            />
            <FireAnimation />
        </group>
    );
}

function Flowers() {
    const flowerRefs = useRef<(THREE.Mesh | null)[]>([]);

    const flowerPositions = useMemo(() => {
        return Array(150)
            .fill(null)
            .map(() => ({
                position: [
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 10,
                ],
                rotation: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                ],
                color: ['#FF69B4', '#FF1493', '#FFA07A', '#FFD700'][
                    Math.floor(Math.random() * 4)
                ],
                speed: Math.random() * 0.2 + 0.1,
            }));
    }, []);

    useFrame((state: RootState) => {
        flowerRefs.current.forEach((flower, index) => {
            if (flower && flowerPositions[index]) {
                const t = state.clock.getElapsedTime();
                flower.position.y =
                    flowerPositions[index].position[1] +
                    Math.sin(t * flowerPositions[index].speed) * 0.5;
                flower.rotation.z = Math.sin(t * 0.3) * 0.2;
                flower.rotation.x = Math.cos(t * 0.2) * 0.2;
            }
        });
    });

    return (
        <group>
            {flowerPositions.map((flower, index) => (
                <mesh
                    key={index}
                    ref={(el) => {
                        flowerRefs.current[index] = el;
                    }}
                    position={
                        flower.position as [number, number, number]
                    }
                    rotation={new THREE.Euler(...flower.rotation)}
                >
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color={flower.color} />
                </mesh>
            ))}
        </group>
    );
}

function FloatingText({
    text,
    position,
    color = 'white',
    size = 0.1,
}: {
    text: string;
    position: [number, number, number];
    color?: string;
    size?: number;
}) {
    const textRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (textRef.current) {
            textRef.current.position.y =
                position[1] +
                Math.sin(clock.getElapsedTime() * 2) * 0.02;
        }
    });

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <DreiText
            ref={textRef}
            position={position}
            color={color}
            fontSize={size}
            maxWidth={3}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="/Geist-Bold.ttf"
        >
            {text}
        </DreiText>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <BrideAndGroom />
            <Flowers />
            <FloatingText
                text="Wedding Invitation"
                position={[0, 5, 0]}
                color="#FFD700"
                size={0.4}
            />
            <FloatingText
                text="Join us in celebrating the marriage of"
                position={[0, 4.2, 0]}
                color="#FFA07A"
                size={0.18}
            />
            <FloatingText
                text="Pranshu Mittle & Shreya Garg"
                position={[0, 3.5, 0]}
                color="#FF69B4"
                size={0.36}
            />
            <FloatingText
                text="Two hearts, one love, one lifetime"
                position={[0, 2.6, 0]}
                color="#FFD700"
                size={0.22}
            />
            <FloatingText
                text="Wedding Ceremony"
                position={[-2, 1.5, 0]}
                color="#FFD700"
                size={0.2}
            />
            <FloatingText
                text="Saturday, November 15, 2024"
                position={[-2, 1.2, 0]}
                color="#FFFFFF"
                size={0.15}
            />
            <FloatingText
                text="11:00 AM"
                position={[-2, 0.9, 0]}
                color="#FFFFFF"
                size={0.15}
            />
            <FloatingText
                text="Reception"
                position={[2, 1.5, 0]}
                color="#FFD700"
                size={0.2}
            />
            <FloatingText
                text="Saturday, November 15, 2024"
                position={[2, 1.2, 0]}
                color="#FFFFFF"
                size={0.15}
            />
            <FloatingText
                text="7:00 PM"
                position={[2, 0.9, 0]}
                color="#FFFFFF"
                size={0.15}
            />
            <FloatingText
                text="Venue"
                position={[0, -0.5, 0]}
                color="#FFD700"
                size={0.4}
            />
            <FloatingText
                text="The Grand Ballroom"
                position={[0, -1, 0]}
                color="#FFFFFF"
                size={0.17}
            />
            <FloatingText
                text="123 Celebration Street, Mumbai, India"
                position={[0, -1.6, 0]}
                color="#FFFFFF"
                size={0.2}
            />
            <FloatingText
                text="A marriage is not a noun; it's a verb. It isn't something you get. It's the way you love your partner every day."
                position={[0, -2.5, 0]}
                color="#FFA07A"
                size={0.17}
            />
            <FloatingText
                text="- Barbara De Angelis"
                position={[0, -3.5, 0]}
                color="#FFFFFF"
                size={0.2}
            />
            <FloatingText
                text="We look forward to celebrating with you!"
                position={[0, -4.5, 0]}
                color="#FFD700"
                size={0.25}
            />
        </>
    );
}

export default function WeddingInvitation3D() {
    return (
        <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
                <Scene />
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    );
}
