import './styles.css';

const FilmStrip = () => {
    // Create an array of frames to render
    const frames = Array.from({ length: 20 }, (_, i) => i);

    return (
        <div className="film-strip">
            {frames.map(i => (
                <div key={i} className="film-frame">
                    {/* maybe put images (svg) here later */}
                </div>
            ))}
        </div>
    );
};

export default function FilmStripCarousel() {
    const carousels = [
        { top: '10%', duration: '80s', direction: 'normal' },
        { top: '30%', duration: '60s', direction: 'reverse' },
        { top: '50%', duration: '70s', direction: 'normal' },
        { top: '70%', duration: '55s', direction: 'reverse' },
        { top: '90%', duration: '75s', direction: 'normal' },
    ];

    return (
        <div className="film-carousel-wrapper">
            {carousels.map((config, index) => (
                <div
                    key={index}
                    className="film-carousel-positioner"
                    style={{ top: config.top }}
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
            ))}
            <div className="vignette-overlay"></div>
        </div>
    );
}
