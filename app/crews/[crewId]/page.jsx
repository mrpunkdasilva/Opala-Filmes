"use client";

import { useParams }                          from "next/navigation";
import { NavBar }                             from "@/app/components/navbar/NavBar";
import { useState , useEffect , useCallback } from "react";
import { useSession }                         from "next-auth/react";
import { useRouter }                          from "next/navigation";
import { MovieSection }                       from "@/app/components/movie-section/movie-section";
import Link                                   from "next/link";
import { Background3D }                       from "@/app/components/movie-section/Background3D";
import { BottomMenu }                           from "@/app/components/bottom-menu/BottomMenu";

export default function CrewDetailPage () {
	const params = useParams();
	const { crewId } = params;
	const { data : session , status } = useSession();
	const router = useRouter();

	const [ crew , setCrew ] = useState( null );
	const [ crewMovies , setCrewMovies ] = useState( [] );
	const [ isLoading , setIsLoading ] = useState( true );
	const [ error , setError ] = useState( null );

	const fetchCrewDetails = useCallback( async () => {
		if ( ! crewId ) return;
		setIsLoading( true );
		setError( null );
		try {
			const res = await fetch( `/api/crews/${ crewId }` );
			if ( ! res.ok ) {
				throw new Error( `Failed to fetch crew details: ${ res.statusText }` );
			}
			const crewData = await res.json();
			setCrew( crewData );
			setCrewMovies( crewData.movies || [] );

		}
		catch ( err ) {
			console.error( "Failed to fetch crew details or movies:" , err );
			setError( err.message );
		}
		finally {
			setIsLoading( false );
		}
	} , [ crewId ] );

	useEffect( () => {
		if ( status === "unauthenticated" ) {
			router.push( "/login" );
			return;
		}

		if ( status === "authenticated" && crewId ) {
			fetchCrewDetails();
		}
	} , [ status , router , crewId , fetchCrewDetails ] );

	let content;

	if ( isLoading ) {
		content = (
			<div className="container mx-auto p-4 text-center mt-10">
				Carregando detalhes da Crew...
			</div>
		);
	} else if ( error ) {
		content = (
			<div className="container mx-auto p-4 text-center mt-10 text-red-500">
				Erro ao carregar detalhes da Crew: { error }
			</div>
		);
	} else if ( ! crew ) {
		content = (
			<div className="container mx-auto p-4 text-center mt-10">
				Crew não encontrada.
			</div>
		);
	} else {
		content = (
			<main className="container mx-auto p-4 pb-16">

				<header className="mb-8">
					<h1 className="title-crew text-4xl font-extrabold text-center text-white mb-8 tracking-wide drop-shadow-lg">
						{ crew.name }
					</h1>
				</header>

				<MovieSection cardsData={ crewMovies } tittle="Filmes da Crew"/>
			</main>
		);
	}

	return (
		<>
			<NavBar/>
			<BottomMenu crewId={crewId}/>
			{content}
		</>
	);
}
