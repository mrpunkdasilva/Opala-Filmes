'use client';

import { useState } from 'react';

export default function InviteMemberForm({ crewId, onSuccess, onError }) {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            if (onError) onError('O campo de email não pode estar vazio.');
            return;
        }

        setIsSubmitting(true);
        if (onError) onError(''); // Clear previous errors

        try {
            const res = await fetch(`/api/crews/${crewId}/invitations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                if (onSuccess) {
                    onSuccess(data.message || 'Convite enviado com sucesso!');
                }
                setEmail('');
            } else {
                if (onError) {
                    onError(data.message || 'Ocorreu um erro ao enviar o convite.');
                }
            }
        } catch (error) {
            if (onError) {
                onError('Ocorreu um erro de conexão.');
            }
            console.error('Failed to send invitation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email do Usuário</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="usuario@exemplo.com"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
                {isSubmitting ? 'Enviando...' : 'Enviar Convite'}
            </button>
        </form>
    );
}
