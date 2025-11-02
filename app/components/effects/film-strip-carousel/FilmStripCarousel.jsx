"use client";

import { useState, useEffect } from 'react';
import './styles.css';

const FilmStrip = () => {
    const frames = Array.from({ length: 20 }, (_, i) => i);
    return (
        <div className="film-strip">
            {frames.map(i => (
                <div key={i} className="film-frame"></div>
            ))}
        </div>
    );
};

export default function FilmStripCarousel() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            const x = (clientX / window.innerWidth) * 2 - 1;
            const y = (clientY / window.innerHeight) * 2 - 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const carousels = [
        { top: '10%', duration: '80s', direction: 'normal', z: -300 },
        { top: '30%', duration: '60s', direction: 'reverse', z: -150 },
        { top: '50%', duration: '70s', direction: 'normal', z: 0 },
        { top: '70%', duration: '55s', direction: 'reverse', z: -150 },
        { top: '90%', duration: '75s', direction: 'normal', z: -300 },
    ];

    return (
        <div className="film-carousel-wrapper">
            {carousels.map((config, index) => {
                const maxRotate = 10;
                const rotateX = -mousePosition.y * maxRotate;
                const rotateY = mousePosition.x * maxRotate;

                return (
                    <div
                        key={index}
                        className="film-carousel-positioner"
                        style={{
                            top: config.top,
                            transform: `
                                translateY(-50%)
                                translateZ(${config.z}px)
                                rotateX(${rotateX}deg)
                                rotateY(${rotateY}deg)
                            `
                        }}
                    >
                        <div
                            className="film-carousel-track"
                            style={{
                                animationDuration: config.duration,
                                animationDirection: config.direction,
                            }}
                        >
                            <FilmStrip />
                            <FilmStrip />
                        </div>
                    </div>
                );
            })}
            <div className="vignette-overlay"></div>
        </div>
    );
}
