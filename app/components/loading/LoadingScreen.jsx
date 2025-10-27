import Image from 'next/image';
import Logo from '@/public/opala-filmes.png';

export default function LoadingScreen() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--deep-space)] text-[var(--cosmic-white)]">
      <div className="relative flex flex-col items-center">
        <Image
          src={Logo}
          alt="Opala Filmes Logo"
          width={200}
          height={200}
          className="animate-pulse"
          priority
        />
        <div className="mt-6 flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-t-[var(--neon-green)] border-r-[var(--neon-green)] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-[var(--neon-green)]">Carregando sua sessão...</p>
        </div>
      </div>
    </main>
  );
}
