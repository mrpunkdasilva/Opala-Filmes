'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function SearchAndAddMovieForm({ crewId, onSuccess, onError }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch(`/api/tmdb/search/movie?query=${encodeURIComponent(searchTerm)}`);
            if (!res.ok) {
                throw new Error('Falha ao buscar filmes.');
            }
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Erro ao buscar filmes.' });
            console.error('Failed to search movies:', err);
        } finally {
            setIsSearching(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            handleSearch();
        }, 500); // Debounce search

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, handleSearch]);

    const handleAddMovie = async (movie) => {
        setIsAdding(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch(`/api/crews/${crewId}/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tmdbId: movie.tmdbId,
                    title: movie.title,
                    type: 'movie', // Assuming only movies for now
                    posterPath: movie.imageUrl,
                    releaseDate: movie.releaseDate,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message || 'Filme adicionado com sucesso!' });
                if (onSuccess) onSuccess();
            } else {
                setMessage({ type: 'error', text: data.message || 'Erro ao adicionar filme.' });
                if (onError) onError(data.message || 'Erro ao adicionar filme.');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Erro de conexão ao adicionar filme.' });
            if (onError) onError('Erro de conexão ao adicionar filme.');
            console.error('Failed to add movie:', err);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Adicionar Filme à Crew</h2>
            <div>
                <input
                    type="text"
                    placeholder="Buscar filmes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            {message.text && (
                <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {isSearching && <p className="text-center">Buscando...</p>}

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                {searchResults.length > 0 ? (
                    searchResults.map(movie => (
                        <div key={movie.tmdbId} className="flex items-center space-x-3 p-2 border-b last:border-b-0">
                            {movie.imageUrl && (
                                <Image 
                                    src={movie.imageUrl} 
                                    alt={movie.title} 
                                    width={50} 
                                    height={75} 
                                    className="rounded"
                                />
                            )}
                            <div className="flex-grow">
                                <p className="font-semibold">{movie.title}</p>
                                <p className="text-sm text-gray-500">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</p>
                            </div>
                            <button
                                onClick={() => handleAddMovie(movie)}
                                disabled={isAdding}
                                className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded disabled:bg-gray-400"
                            >
                                {isAdding ? 'Adicionando...' : 'Adicionar'}
                            </button>
                        </div>
                    ))
                ) : ( !isSearching && searchTerm.trim() &&
                    <p className="text-center text-gray-500">Nenhum filme encontrado.</p>
                )}
            </div>
        </div>
    );
}
