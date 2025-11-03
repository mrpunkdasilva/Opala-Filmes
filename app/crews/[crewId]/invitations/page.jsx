'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function InvitationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [invitations, setInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchInvitations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/invitations');
            if (!res.ok) {
                throw new Error('Falha ao buscar convites.');
            }
            const data = await res.json();
            setInvitations(data);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch invitations:", err);
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
            fetchInvitations();
        }
    }, [status, router, fetchInvitations]);

    const handleAction = async (invitationId, action) => {
        setMessage({ type: '', text: '' }); // Clear previous messages
        try {
            const res = await fetch(`/api/invitations/${invitationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                // Remove the processed invitation from the list
                setInvitations(prev => prev.filter(inv => inv._id !== invitationId));
            } else {
                setMessage({ type: 'error', text: data.message || 'Ocorreu um erro ao processar o convite.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Ocorreu um erro de conexão.' });
            console.error(`Failed to ${action} invitation:`, err);
        }
    };

    if (isLoading) {
        return <div className="text-center mt-10">Carregando convites...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">Erro: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Meus Convites</h1>

            {message.text && (
                <div className={`p-3 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {invitations.length === 0 ? (
                <p className="text-center text-gray-600">Você não tem convites pendentes no momento.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {invitations.map(invite => (
                        <div key={invite._id} className="border rounded-lg p-4 shadow-lg">
                            <h2 className="text-xl font-semibold">Convite para {invite.crewDetails.name}</h2>
                            <p className="text-gray-600 mt-2">De: {invite.senderDetails.username}</p>
                            <p className="text-sm text-gray-500 mt-4">Enviado em: {new Date(invite.createdAt).toLocaleDateString()}</p>
                            <div className="mt-4 flex space-x-2">
                                <button 
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleAction(invite._id, 'accept')}
                                >
                                    Aceitar
                                </button>
                                <button 
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleAction(invite._id, 'decline')}
                                >
                                    Recusar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
