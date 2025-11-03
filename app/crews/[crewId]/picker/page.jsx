'use client';

import React, { useState, useEffect } from 'react';
import MoviePicker from '@/app/components/sort-movie/SortMovie';
import LoadingScreen from '@/app/components/loading/LoadingScreen';
import { Alert }                      from "@/app/components/alert/Alert";
export default function MoviePickerPage({ params }) {
    const { crewId } = params;
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCrewMovies() {
            if (!crewId) {
                setError('Crew ID is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`/api/crews/${crewId}/movies`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch movies: ${response.statusText}`);
                }
                const data = await response.json();
                // Assuming data is an array of movie objects with image, title, description, uuid
                setMovies(data);
            } catch (err) {
                console.error('Error fetching crew movies:', err);
                setError(err.message || 'Failed to load movies.');
            } finally {
                setLoading(false);
            }
        }

        fetchCrewMovies();
    }, [crewId]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <Alert message={error} type="error" />;
    }

    if (movies.length === 0) {
        return <Alert message="No movies found for this crew. Add some movies to start picking!" type="info" />;
    }

    return (
        <div className="movie-picker-page-container">
            <h1 className="movie-picker-page-title">Pick a Movie for Your Crew!</h1>
            <MoviePicker cardsData={movies} />
        </div>
    );
}
