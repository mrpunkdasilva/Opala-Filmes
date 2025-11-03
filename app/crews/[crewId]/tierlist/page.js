'use client'
import { useEffect, useState } from 'react';
import { NavBar }              from "@/app/components/navbar/NavBar";
import { TierList }            from "@/app/components/tier-list/TierList";
import { get, ref }            from 'firebase/database';
import { database }            from "@/app/firebase/firebase";

const classifyMovieByRating = (rating) => {
    if (!rating && rating !== 0) return null;
    if (rating >= 4.5) return 'S';
    if (rating >= 4.0) return 'A';
    if (rating >= 3.5) return 'B';
    if (rating >= 3.0) return 'C';
    if (rating >= 2.0) return 'D';
    return 'F';
};

export default function TierListPage() {
    const [classifiedMovies, setClassifiedMovies] = useState({
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        F: []
    });
    const [unrankedMovies, setUnrankedMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieRef = ref(database, 'movies');
                const snapshot = await get(movieRef);
                const movies = snapshot.val();
                
                const allMovies = Object.entries(movies).map(([key, value]) => ({
                    uuid: key,
                    ...value
                }));
                
                // Separar filmes classificados e não classificados
                const unrated = [];
                const classified = {
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: [],
                    F: []
                };

                allMovies.forEach(movie => {
                    // Se o filme foi assistido e tem classificação, vai para uma tier
                    if (movie.watched && movie.rating) {
                        const tier = classifyMovieByRating(movie.rating);
                        if (tier) {
                            classified[tier].push(movie);
                        } else {
                            unrated.push(movie);
                        }
                    } else {
                        // Se não foi assistido ou não tem classificação, vai para não classificados
                        unrated.push(movie);
                    }
                });

                setClassifiedMovies(classified);
                setUnrankedMovies(unrated);
            } catch (error) {
                console.error('Erro ao buscar filmes:', error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar 
                navigation={[]} 
                onClick={() => {}} 
                isHome={false}
            />
            <main className="flex-1 container mx-auto px-4 py-8">
                <TierList 
                    initialTiers={classifiedMovies}
                    unrankedMovies={unrankedMovies}
                />
            </main>
        </div>
    );
}
