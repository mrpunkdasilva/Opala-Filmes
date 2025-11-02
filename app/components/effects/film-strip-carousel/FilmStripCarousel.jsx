"use client";

import { useState, useEffect } from 'react';
import './styles.css';
import { getPopularMovies } from '@/app/services/tmdb';

const FilmStrip = ({ movies }) => {
    // Se não houver filmes, renderiza os frames vazios como fallback
    if (!movies || movies.length === 0) {
        const frames = Array.from({ length: 20 }, (_, i) => i);
        return (
            <div className="film-strip">
                {frames.map(i => (
                    <div key={i} className="film-frame"></div>
                ))}
            </div>
        );
    }

    // Usa os filmes para renderizar as imagens
    return (
        <div className="film-strip">
            {movies.map((movie, index) => (
                movie.imageUrl ? (
                    <div key={movie.tmdbId || index} className="film-frame">
                        <img src={movie.imageUrl} alt={movie.title} className="film-frame-image" />
                    </div>
                ) : (
                    <div key={movie.tmdbId || index} className="film-frame film-frame-placeholder">
                        {/* Placeholder para filmes sem imagem */}
                        <span>{movie.title}</span>
                    </div>
                )
            ))}
        </div>
    );
};

export default function FilmStripCarousel() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [movies, setMovies] = useState([]); // Novo estado para armazenar os filmes

    useEffect(() => {
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            const x = (clientX / window.innerWidth) * 2 - 1;
            const y = (clientY / window.innerHeight) * 2 - 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Buscar filmes populares ao montar o componente
        const fetchMovies = async () => {
            const popularMovies = await getPopularMovies();
            setMovies(popularMovies);
        };
        fetchMovies();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const carousels = [
        { top: '10%', baseDuration: 80, direction: 'normal', baseZ: -300 },
        { top: '30%', baseDuration: 60, direction: 'reverse', baseZ: -150 },
        { top: '50%', baseDuration: 70, direction: 'normal', baseZ: 0 },
        { top: '70%', baseDuration: 55, direction: 'reverse', baseZ: -150 },
        { top: '90%', baseDuration: 75, direction: 'normal', baseZ: -300 },
    ];

    return (
        <div className="film-carousel-wrapper">
            {carousels.map((config, index) => {
                const maxRotate = 10;
                const rotateX = -mousePosition.y * maxRotate;
                const rotateY = mousePosition.x * maxRotate;

                const depthFactor = (config.baseZ + 300) / 300;
                const dynamicZ = config.baseZ + (mousePosition.y * 50 * depthFactor);
                const opacity = 0.5 + (0.5 * depthFactor);
                const brightness = 0.7 + (0.3 * depthFactor);

                // Variação da duração da animação
                const speedFactor = 1 - (Math.abs(mousePosition.x) * 0.2); // Reduz a velocidade quando o mouse está mais para os lados
                const animationDuration = `${config.baseDuration * speedFactor}s`;

                // const shadowX = mousePosition.x * 20; // Movimento horizontal da sombra
                // const shadowY = mousePosition.y * 20; // Movimento vertical da sombra
                // const boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 255, 255, 0.5)`; // Sombra ciano

                const skewX = mousePosition.x * 2; // Pequena inclinação horizontal
                const skewY = mousePosition.y * 2; // Pequena inclinação vertical
                const scaleFactor = 1 + (Math.abs(mousePosition.x) * 0.05); // Pequena escala

                const blurAmount = 0.5 + ((1 - depthFactor) * 1.5); // Blur varia de 0.5px a 2px

                return (
                    <div
                        key={index}
                        className="film-carousel-positioner"
                        style={{
                            top: config.top,
                            transform: `
                                translateY(-50%)
                                translateZ(${dynamicZ}px)
                                rotateX(${rotateX}deg)
                                rotateY(${rotateY}deg)
                                skewX(${skewX}deg)
                                skewY(${skewY}deg)
                                scale(${scaleFactor})
                            `,
                            opacity: opacity,
                            filter: `brightness(${brightness}) blur(${blurAmount}px)`, // Adiciona o blur dinâmico
                        }}
                    >
                        <div
                            className="film-carousel-track"
                            style={{
                                animationDuration: animationDuration,
                                animationDirection: config.direction,
                            }}
                        >
                            <FilmStrip movies={movies} />
                            <FilmStrip movies={movies} />
                        </div>
                    </div>
                );
            })}
            <div className="vignette-overlay"></div>
        </div>
    );
}
