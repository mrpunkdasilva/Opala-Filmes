import { Card }         from "@/app/components/Card";
import Link             from "next/link";
import { Background3D } from './Background3D';
import './styles.css';

export const MovieSection = ({ cardsData, tittle }) => {
    return (
        <section className="movie-section">
            
            <h1 className="movie-section-title">{tittle}</h1>

            <div className="movies-grid">
                {cardsData.length === 0 ? (
                    <div className="empty-message">
                        Sem filmes
                    </div>
                ) : (
                    cardsData.map((card, index) => (
                        <Link 
                            href={`/${card.uuid}`} 
                            key={card.uuid || index}
                            className="movie-link"
                        >
                            <Card
                                image={card.image}
                                title={card.title}
                                description={card.description}
                                rating={card.rating}
                            />
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}
