'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MovieCard } from './MovieCard';
import './styles.css'; // Assuming shared styles

// Helper function to reorder a list
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

// Helper function to move an item from one list to another
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

export default function CrewTierList({ crewId, tierList, crewMovies, onUpdateTierList }) {
    const [localTierList, setLocalTierList] = useState(tierList);
    const [unrankedMovies, setUnrankedMovies] = useState([]);

    // Helper to find a movie by its _id
    const findMovieById = (movieId) => {
        return crewMovies.find(movie => movie._id === movieId);
    };

    // Initialize local state from props
    useEffect(() => {
        setLocalTierList(tierList);
        // Determine unranked movies based on the current tierList and all crewMovies
        const allTieredMovieIds = new Set();
        tierList.tiers.forEach(tier => {
            tier.mediaIds.forEach(id => allTieredMovieIds.add(id));
        });
        setUnrankedMovies(crewMovies.filter(movie => !allTieredMovieIds.has(movie._id)));
    }, [tierList, crewMovies]);

    const getList = useCallback((id) => {
        if (id === 'unranked') {
            return unrankedMovies.map(movie => movie._id);
        }
        const tier = localTierList.tiers.find(t => t._id === id);
        return tier ? tier.mediaIds : [];
    }, [localTierList, unrankedMovies]);

    const onDragEnd = useCallback((result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        const sId = source.droppableId;
        const dId = destination.droppableId;

        let newLocalTierList = { ...localTierList };
        let newUnrankedMovies = [...unrankedMovies];

        if (sId === dId) {
            // Reordering within the same list (tier or unranked)
            const items = reorder(
                getList(sId),
                source.index,
                destination.index
            );

            if (sId === 'unranked') {
                newUnrankedMovies = items.map(findMovieById);
            } else {
                newLocalTierList.tiers = newLocalTierList.tiers.map(tier =>
                    tier._id === sId ? { ...tier, mediaIds: items } : tier
                );
            }
        } else {
            // Moving between lists (tiers or unranked)
            const sourceList = getList(sId);
            const destinationList = getList(dId);

            const movedResult = move(
                sourceList,
                destinationList,
                source,
                destination
            );

            // Update unranked movies
            if (sId === 'unranked') {
                newUnrankedMovies = movedResult[sId].map(findMovieById);
            } else if (dId === 'unranked') {
                newUnrankedMovies = movedResult[dId].map(findMovieById);
            }

            // Update tiers
            newLocalTierList.tiers = newLocalTierList.tiers.map(tier => {
                if (tier._id === sId) {
                    return { ...tier, mediaIds: movedResult[sId] || [] };
                }
                if (tier._id === dId) {
                    return { ...tier, mediaIds: movedResult[dId] || [] };
                }
                return tier;
            });
        }

        setLocalTierList(newLocalTierList);
        setUnrankedMovies(newUnrankedMovies);

        // Persist changes to the API
        onUpdateTierList({
            ...newLocalTierList,
            tiers: newLocalTierList.tiers.map(tier => ({ ...tier, mediaIds: tier.mediaIds })) // Ensure mediaIds are updated
        });

    }, [getList, localTierList, unrankedMovies, onUpdateTierList, findMovieById]);


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="tier-list-container">
                <h2 className="tier-list-title text-2xl font-bold mb-4">{localTierList.name}</h2>
            
                {localTierList.tiers.length > 0 ? (
                    localTierList.tiers.map((tier) => (
                        <Droppable droppableId={tier._id} key={tier._id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`tier-row border-b border-gray-300 py-2 ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}
                                >
                                    <div className="tier-label font-semibold text-lg mb-2">{tier.rank} - {tier.title}</div>
                                    <div className="tier-content flex flex-wrap gap-2 min-h-[50px]">
                                        {tier.mediaIds.length > 0 ? (
                                            tier.mediaIds.map((mediaId, index) => {
                                                const movie = findMovieById(mediaId);
                                                return movie ? (
                                                    <Draggable key={movie._id} draggableId={movie._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    opacity: snapshot.isDragging ? '0.8' : '1',
                                                                }}
                                                            >
                                                                <MovieCard
                                                                    movie={movie}
                                                                    isStatic={false} // Not static anymore
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ) : null;
                                            })
                                        ) : (
                                            !snapshot.isDraggingOver && <p className="text-gray-500 text-sm p-2">Arraste filmes para cá.</p>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))
                ) : (
                    <p className="text-gray-600">Nenhuma categoria definida para esta tier list.</p>
                )}

                <Droppable droppableId="unranked">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`unranked-section mt-6 border-t border-gray-300 pt-4 ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                        >
                            <h3 className="text-xl font-semibold mb-2">Filmes não classificados</h3>
                            <div className="unranked-content flex flex-wrap gap-2 min-h-[50px]">
                                {unrankedMovies.length > 0 ? (
                                    unrankedMovies.map((movie, index) => (
                                        <Draggable key={movie._id} draggableId={movie._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        opacity: snapshot.isDragging ? '0.8' : '1',
                                                    }}
                                                >
                                                    <MovieCard
                                                        movie={movie}
                                                        isStatic={false} // Not static anymore
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                ) : (
                                    !snapshot.isDraggingOver && <p className="text-gray-500 text-sm p-2">Todos os filmes estão em categorias ou não há filmes.</p>
                                )}
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}
