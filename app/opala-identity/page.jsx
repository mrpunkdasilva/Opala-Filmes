"use client";

import { NavBar } from "@/app/components/navbar/NavBar";
import { useIdentity } from "@/app/contexts/IdentityContext";
import { GemScene } from "@/app/components/GemScene";
import { useSession } from "next-auth/react";

export default function OpalaIdentityPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { identity, isLoading, createIdentity } = useIdentity();

  // Combined loading state
  const isPageLoading = sessionStatus === 'loading' || isLoading;

  if (isPageLoading) {
    return (
      <div>
        <NavBar isHome={false} />
        <main className="container mx-auto py-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-4">
            Opala Identity
          </h1>
          <p className="text-[var(--cosmic-white)]">Carregando identidade...</p>
        </main>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div>
        <NavBar isHome={false} />
        <main className="container mx-auto py-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-4">
            Opala Identity
          </h1>
          <p className="text-[var(--cosmic-white)]">
            Você precisa estar logado para ver esta página.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <NavBar isHome={false} />
      <main className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-10">
          Opala Identity
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 bg-[var(--deep-space-light)] p-8 rounded-2xl shadow-xl max-w-3xl w-full">
          
          {/* Gem Display or Creation Button */}
          <div className="flex flex-col items-center justify-center w-48 h-48">
            {identity && identity.gemSeed ? (
              <GemScene seed={identity.gemSeed} />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-[var(--cosmic-white)]">Sua identidade Opala ainda não foi forjada.</p>
                <button
                  onClick={createIdentity}
                  disabled={isPageLoading}
                  className="px-4 py-2 font-bold text-[var(--deep-space)] bg-[var(--neon-green)] rounded-md hover:bg-[var(--neon-green-alt)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--deep-space)] focus:ring-[var(--neon-green)] disabled:opacity-50 transition-all"
                >
                  {isPageLoading ? 'Forjando...' : 'Forjar Identidade'}
                </button>
              </div>
            )}
          </div>

          {/* User Data */}
          <div className="flex flex-col text-left">
            <div className="mb-4">
              <p className="text-sm text-[var(--cosmic-white)] opacity-70">Nome:</p>
              <p className="text-xl text-[var(--neon-green)] font-semibold">
                {session.user.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--cosmic-white)] opacity-70">Email:</p>
              <p className="text-xl text-[var(--neon-green)] font-semibold">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}