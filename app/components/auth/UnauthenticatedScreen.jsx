"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FilmStripCarousel from '@/app/components/effects/film-strip-carousel/FilmStripCarousel';
import { NavBar } from '@/app/components/navbar/NavBar';
import './styles.css'; // Import the new CSS file

export default function UnauthenticatedScreen() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="flex flex-col h-screen">
            <FilmStripCarousel />
            <NavBar navigation={[]} onClick={() => {}} isHome={true} />
            <div className="flex-grow flex flex-col justify-center items-center text-center" style={{ zIndex: 1 }}>
                <div
                    className="fade-in-up"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', animationDelay: '0.2s' }}
                >
                    <h1 className="text-4xl font-bold text-white">
                        A noite de cinema, <em className="italic text-[var(--neon-green)]">reimaginada</em>.
                    </h1>
                    <p className="text-lg text-gray-300 mt-4 leading-relaxed max-w-xl">
                        <strong className="text-[var(--neon-green)]">Opala Filmes</strong> é o seu QG para transformar qualquer sessão em um <strong className="text-[var(--neon-green)]">evento</strong>. Crie tier lists com sua <em className="italic text-[var(--neon-green)]">crew</em>, sorteie o próximo filme e prove quem manda no bom gosto. A <strong className="text-[var(--neon-green)]">resenha</strong> é garantida.
                    </p>
                </div>
                <button
                    onClick={handleLogin}
                    className="mt-8 px-8 py-3 font-bold text-[var(--deep-space)] bg-[var(--neon-green)] rounded-md hover:bg-[var(--neon-green-alt)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--deep-space)] focus:ring-[var(--neon-green)] transition-all fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                >
                    Fazer Login
                </button>
                <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <p className="text-sm text-gray-400 mt-6">
                        Ainda não tem uma conta?{' '}
                        <Link href="/register" className="font-bold text-[var(--neon-green)] hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
