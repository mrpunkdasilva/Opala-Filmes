'use client'

import { NavBar } from "@/app/components/navbar/NavBar";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useEffect, useState } from "react";

// Function to generate a random SVG gem
const generateGemSVG = (seed) => {
    // Simple pseudo-random number generator for consistency if seed is provided
    let s = seed ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : Math.random() * 1000; 
    const pseudoRandom = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };

    const colors = ['#0BDB72', '#FF00FF', '#00FFFF', '#FFFF00', '#FF69B4', '#ADFF2F', '#8A2BE2', '#FF4500']; // Neon colors
    const numPoints = Math.floor(pseudoRandom() * 4) + 3; // 3 to 6 points for a polygon
    let points = [];
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = 30 + pseudoRandom() * 20; // Vary radius for irregular shape
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        points.push(`${x},${y}`);
    }

    const fillColor = colors[Math.floor(pseudoRandom() * colors.length)];
    const strokeColor = colors[Math.floor(pseudoRandom() * colors.length)];

    return `
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="${points.join(' ')}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" />
        </svg>
    `;
};

export default function OpalaIdentityPage() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    const [gemSVG, setGemSVG] = useState('');

    useEffect(() => {
        setMounted(true);
        if (session?.user?.id) { // Use user ID as seed for consistent gem generation
            setGemSVG(generateGemSVG(session.user.id));
        } else {
            setGemSVG(generateGemSVG(String(Math.random()))); // Fallback for unauthenticated or no ID
        }
    }, [session]);

    if (!mounted || status === 'loading') {
        return (
            <div>
                <NavBar isHome={false} />
                <main className="container mx-auto py-8 text-center">
                    <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-4">Opala Identity</h1>
                    <p className="text-[var(--cosmic-white)]">Carregando perfil...</p>
                </main>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div>
                <NavBar isHome={false} />
                <main className="container mx-auto py-8 text-center">
                    <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-4">Opala Identity</h1>
                    <p className="text-[var(--cosmic-white)]">Você precisa estar logado para ver esta página.</p>
                </main>
            </div>
        );
    }

    return (
        <div>
            <NavBar isHome={false} />
            <main className="container mx-auto py-8 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-8">Opala Identity</h1>
                
                {/* Gem ID */}
                {gemSVG && (
                    <div 
                        className="w-32 h-32 mb-6 flex items-center justify-center border-4 border-[var(--neon-green)] rounded-full shadow-lg"
                        dangerouslySetInnerHTML={{ __html: gemSVG }}
                    />
                )}

                {session.user.image && (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User Avatar"}
                        width={128}
                        height={128}
                        className="rounded-full border-4 border-[var(--neon-green)] mb-6 shadow-lg"
                        priority
                    />
                )}

                <div className="bg-[var(--deep-space-light)] p-8 rounded-lg shadow-xl max-w-md w-full">
                    <div className="mb-4">
                        <p className="text-sm text-[var(--cosmic-white)] opacity-70">Nome:</p>
                        <p className="text-xl text-[var(--neon-green)] font-semibold">{session.user.name}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-[var(--cosmic-white)] opacity-70">Email:</p>
                        <p className="text-xl text-[var(--neon-green)] font-semibold">{session.user.email}</p>
                    </div>
                    {/* Adicionar mais informações do perfil aqui, se disponíveis na sessão */}
                </div>
            </main>
        </div>
    );
}
