import { NextResponse } from 'next/server';
import { searchMovies } from '@/app/services/tmdb';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ message: 'Parâmetro de busca (query) é obrigatório.' }, { status: 400 });
    }

    try {
        const movies = await searchMovies(query);
        return NextResponse.json(movies, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar filmes do TMDB:', error);
        return NextResponse.json({ message: 'Erro interno do servidor ao buscar filmes.' }, { status: 500 });
    }
}
