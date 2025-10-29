import { NavBar } from "@/app/components/navbar/NavBar";

export default function OpalaIdentityPage() {
    return (
        <div>
            <NavBar isHome={false} />
            <main className="container mx-auto py-8">
                <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-4">Opala Identity</h1>
                <p className="text-[var(--cosmic-white)]">Página em construção para o seu perfil.</p>
            </main>
        </div>
    );
}
