import Image from 'next/image';

export const MovieCard = ({ movie, provided, snapshot }) => {
    return (
        <div
            ref={provided?.innerRef}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            className={`tier-movie relative rounded-lg overflow-hidden shadow-md ${snapshot?.isDragging ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                ...provided?.draggableProps.style,
            }}
        >
            {movie.posterPath ? (
                <Image
                    src={movie.posterPath}
                    alt={movie.title}
                    width={100} // Adjust as needed
                    height={150} // Adjust as needed
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-t-lg"
                />
            ) : (
                <div className="w-full h-[150px] bg-gray-200 flex items-center justify-center text-center text-gray-500 text-xs p-2">
                    No Poster
                </div>
            )}
            <div className="p-1 bg-white text-center text-xs font-semibold truncate">
                {movie.title}
            </div>
        </div>
    );
};