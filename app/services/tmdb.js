const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

if (!TMDB_API_KEY) {
    console.error('Erro: A chave da API TMDB (NEXT_PUBLIC_TMDB_API_KEY) não está definida nas variáveis de ambiente.');
}

export const searchMovies = async (query) => {
    if (!query || !TMDB_API_KEY) return [];
    
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`
        );
        const data = await response.json();
        
        if (!data.results) {
            console.error('Erro: a resposta da API TMDB não contém a propriedade \'results\'.', data);
            return [];
        }

        return data.results.map(movie => ({
            tmdbId: movie.id,
            title: movie.title,
            description: movie.overview,
            imageUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            releaseDate: movie.release_date,
            rating: movie.vote_average / 2 // TMDB usa escala de 0-10, convertendo para 0-5
        }));
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return [];
    }
};

export const getPopularMovies = async () => {
    if (!TMDB_API_KEY) return [];

    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&language=pt-BR`
        );
        const data = await response.json();
        
        if (!data.results) {
            console.error('Erro: a resposta da API TMDB não contém a propriedade \'results\'.', data);
            return [];
        }

        return data.results.map(movie => {
            const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : null;
            return {
                tmdbId: movie.id,
                title: movie.title,
                description: movie.overview,
                imageUrl: imageUrl,
                releaseDate: movie.release_date,
                rating: movie.vote_average / 2
            };
        });
    } catch (error) {
        console.error('Erro ao buscar filmes populares:', error);
        return [];
    }
};