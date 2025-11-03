// components/Card.js
import { RenderStars } from "@/app/components/rating/RenderStarts";
import './card/styles.css';

export const Card = ({ image, title, description, rating }) => {
    // Função para truncar o texto da descrição
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="movie-card">
            {/* Cantos decorativos */}
            <div className="movie-card-corner movie-card-corner-tl"></div>
            <div className="movie-card-corner movie-card-corner-tr"></div>
            <div className="movie-card-corner movie-card-corner-bl"></div>
            <div className="movie-card-corner movie-card-corner-br"></div>
            
            <img 
                className="movie-card-image" 
                src={image} 
                alt={title}
                onError={(e) => {
                    e.target.src = '/placeholder-movie.jpg'; // Adicione uma imagem de placeholder
                }}
            />
            <div className="movie-card-content">
                <h2 className="movie-card-title" title={title}>
                    {title}
                </h2>
                <p className="movie-card-description">
                    {truncateText(description, 120)}
                </p>
                <div className="movie-card-rating">
                    <RenderStars rating={rating} />
                    <span>{typeof rating === 'number' ? rating.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};
