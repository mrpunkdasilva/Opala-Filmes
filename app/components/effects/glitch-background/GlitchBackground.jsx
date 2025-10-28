"use client";

import { useState, useEffect } from "react";
import { getPopularMovies } from "@/app/services/tmdb";
import "./styles.css";

export default function GlitchBackground() {
  const [movies, setMovies] = useState([]);
  const [currentPoster, setCurrentPoster] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      const popularMovies = await getPopularMovies();
      const moviesWithPosters = popularMovies.filter(movie => movie.imageUrl);
      setMovies(moviesWithPosters);
      if (moviesWithPosters.length > 0) {
        const randomIndex = Math.floor(Math.random() * moviesWithPosters.length);
        setCurrentPoster(moviesWithPosters[randomIndex].imageUrl);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * movies.length);
        setCurrentPoster(movies[randomIndex].imageUrl);
      }, 10000); // Change poster every 10 seconds

      return () => clearInterval(interval);
    }
  }, [movies]);

  return (
    <div className="glitch-background">
      {currentPoster && (
        <div
          className="background-poster"
          style={{ backgroundImage: `url(${currentPoster})` }}
        />
      )}
      <div className="glitch-overlay"></div>
    </div>
  );
}
