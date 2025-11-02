"use client"
import {MovieSection} from "@/app/components/movie-section";
import {NavBar} from "@/app/components/navbar/NavBar";
import {useEffect, useState} from "react";
import {SaveMovieModal} from "@/app/components/modal/SaveMovieModal";
import {get, ref, set} from 'firebase/database'
import {database} from "@/app/firebase/firebase";
import {Alert} from "@/app/components/alert/Alert";
import MoviePicker from "@/app/components/sort-movie/SortMovie";
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';
import LoadingScreen from '@/app/components/loading/LoadingScreen';
import FilmStripCarousel from '@/app/components/effects/film-strip-carousel/FilmStripCarousel';

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isWatchedMovies, setIsWatchedMovies] = useState(false);
    const [isSortMovie, setIsSortMovie] = useState(false);
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [isCreateMovieModalOpen, setCreateMovieModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && database) {
            getMovies().then((result) => {
                if (result) {
                    const moviesArray = Object.entries(result).map(([key, value]) => ({
                        id: key,
                        ...value
                    }));
                    setMovies(moviesArray)
                }
            }).catch((e) => console.log("Error fetching movies:", e))
        }
    }, [status, alertMessage]);

    async function getMovies() {
        const movieRef = ref(database, 'movies')
        const snapshot = await get(movieRef)
        return snapshot.val();
    }

    const handleSortMovie = () => {
        setIsWatchedMovies(false);
        setIsSortMovie(true);
    };

    const handleTabMovie = (type) => {
        if (type === 'Para assistir') setIsWatchedMovies(false)
        else setIsWatchedMovies(true)
        setIsSortMovie(false);
    }

    useEffect(() => {
        if (movies) {
            const filtered = movies.filter(movie => movie.watched === isWatchedMovies);
            setFilteredMovies(filtered);
        }
    }, [movies, isWatchedMovies]);

    const handleTierList = () => {
        router.push('/tierlist');
    };

    const navigation = [
        {name: 'Para assistir', onClick: handleTabMovie, current: !isWatchedMovies && !isSortMovie},
        {name: 'Assitidos', onClick: handleTabMovie, current: isWatchedMovies && !isSortMovie},
        {name: 'Sorteio', onClick: handleSortMovie, current: isSortMovie},
        {name: 'Tier List', onClick: handleTierList, current: false},
    ]

    const handleSaveMovie = async ({title, description, imageUrl, watched}) => {
        if (!database) {
            setAlertMessage("A conexão com o banco de dados não está configurada.");
            setIsError(true);
            setTimeout(() => setAlertMessage(""), 3000);
            return;
        }
        const movieUuid = crypto.randomUUID();
        try {
            const movieToSave = {
                uuid: movieUuid,
                title,
                description,
                image: imageUrl,
                watched,
                rating: 0,
                votes: 0
            }
            const movieRef = ref(database, `movies/${movieUuid}`);
            await set(movieRef, movieToSave);
            setIsError(false);
            setAlertMessage("Filme criado com sucesso!");

            setTimeout(() => setAlertMessage(""), 3000);
        } catch (e) {
            setIsError(true);
            setAlertMessage("Erro ao criar filme!");

            setTimeout(() => setAlertMessage(""), 3000);
            console.log(e)
        } finally {
            setCreateMovieModalOpen(false);

        }
    }

    if (status === 'loading') {
        return <LoadingScreen />;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex flex-col h-screen">
                <FilmStripCarousel />
                <NavBar navigation={[]} onClick={() => {}} isHome={true}/>
                <div className="flex-grow flex justify-center items-center" style={{zIndex: 1}}>
                    <h1 className="text-2xl font-bold text-white text-center"
                        style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'}}>
                        Bem-vindo ao Opala Filmes!<br/>
                        Faça login para começar a organizar seus filmes.
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {alertMessage && (
                <Alert alertMessage={alertMessage} isSuccess={!isError}/>
            )}
            <NavBar navigation={navigation} onClick={() => setCreateMovieModalOpen(true)} isHome={true}/>
            <div className="mt-6">
                {!isSortMovie ? (
                    <MovieSection cardsData={filteredMovies} tittle={isWatchedMovies ? "Assistidos" : "Para assistir"}/>
                ) : (
                    <MoviePicker cardsData={filteredMovies} />
                )}
            </div>
            <SaveMovieModal isOpen={isCreateMovieModalOpen} onClose={() => setCreateMovieModalOpen(false)}
                            onSubmit={handleSaveMovie}/>
        </div>
    );
}

