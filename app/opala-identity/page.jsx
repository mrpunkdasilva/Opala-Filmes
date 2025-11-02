"use client";

import { NavBar }               from "@/app/components/navbar/NavBar";
import { useSession }           from "next-auth/react";
import Image                    from "next/image";
import { useEffect , useState } from "react";
import { GemScene }             from "@/app/components/GemScene";

export default function OpalaIdentityPage () {
	const { data : session , status } = useSession();
	const [ mounted , setMounted ] = useState( false );
	const [ seed , setSeed ] = useState( "" );

	useEffect( () => {
		setMounted( true );
		if ( session?.user?.id ) {
			setSeed( String( session.user.id ) );
		}
		else {
			setSeed( String( Math.random() ) );
		}
	} , [ session ] );

	if ( ! mounted || status === "loading" ) {
		return (
			<div>
				<NavBar isHome={ false }/>
				<main className="container mx-auto py-8 text-center">
					<h1 className="text-4xl font-bold text-[var(--neon-green)] mb-4">
						Opala Identity
					</h1>
					<p className="text-[var(--cosmic-white)]">Carregando perfil...</p>
				</main>
			</div>
		);
	}

	if ( status === "unauthenticated" ) {
		return (
			<div>
				<NavBar isHome={ false }/>
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
			<NavBar isHome={ false }/>
			<main className="container mx-auto py-8 flex flex-col items-center">
				<h1 className="text-4xl font-bold text-[var(--neon-green)] mb-10">
					Opala Identity
				</h1>

				{/* Container principal com layout horizontal */ }
				<div
					className="flex flex-col md:flex-row items-center justify-center gap-10 bg-[var(--deep-space-light)] p-8 rounded-2xl shadow-xl max-w-3xl w-full">

					{/* Gema */ }
					<div className="flex flex-col items-center justify-center">
						<div className="w-40 h-40 flex items-center justify-center">
							<GemScene seed={ seed }/>
						</div>

						{ session.user.image && (
							<Image
								src={ session.user.image }
								alt={ session.user.name || "User Avatar" }
								width={ 96 }
								height={ 96 }
								className="rounded-full border-2 border-[var(--neon-green)] mt-4 shadow-md"
								priority
							/>
						) }
					</div>

					{/* Dados do usuário */ }
					<div className="flex flex-col text-left">
						<div className="mb-4">
							<p className="text-sm text-[var(--cosmic-white)] opacity-70">Nome:</p>
							<p className="text-xl text-[var(--neon-green)] font-semibold">
								{ session.user.name }
							</p>
						</div>
						<div>
							<p className="text-sm text-[var(--cosmic-white)] opacity-70">Email:</p>
							<p className="text-xl text-[var(--neon-green)] font-semibold">
								{ session.user.email }
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
