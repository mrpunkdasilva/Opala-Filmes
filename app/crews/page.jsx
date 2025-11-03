'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GenericModal from '@/app/components/modal/GenericModal';
import CreateCrewForm from '@/app/components/form/CreateCrewForm';
import { NavBar } from '@/app/components/navbar/NavBar';

export default function CrewsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [crews, setCrews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const fetchCrews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/crews');
            if (!res.ok) {
                throw new Error(`Failed to fetch crews: ${res.statusText}`);
            }
            const data = await res.json();
            setCrews(data);
        } catch (error) {
            console.error("Failed to fetch crews:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchCrews();
        }
    }, [status, router, fetchCrews]);

    const handleCrewCreated = () => {
        setIsModalOpen(false);
        fetchCrews();
    };

    if (isLoading) {
        return <div className="text-center mt-10">Carregando...</div>;
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Minhas Crews</h1>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsModalOpen(true)}
                >
                    Criar Nova Crew
                </button>
            </div>

            <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Nova Crew">
                <CreateCrewForm onSuccess={handleCrewCreated} />
            </GenericModal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crews.length > 0 ? (
                    crews.map(crew => (
                        <Link href={`/crews/${crew._id}`} key={crew._id}>
                            <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">{crew.name}</h2>
                                    <p className="text-gray-600 mt-2 h-10 overflow-hidden">{crew.description}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">Membros: {crew.members.length}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>Você ainda não faz parte de nenhuma crew. Que tal criar uma?</p>
                )}
            </div>
            </div>
        </>
    );
}