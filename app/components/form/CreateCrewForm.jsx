'use client';

import { useState } from 'react';

export default function CreateCrewForm({ onSuccess }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name) {
            setError('O nome da crew é obrigatório.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/crews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });

            if (res.ok) {
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                const data = await res.json();
                setError(data.message || 'Ocorreu um erro ao criar a crew.');
            }
        } catch (error) {
            setError('Ocorreu um erro de conexão.');
            console.error('Failed to create crew:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-center">Criar Nova Crew</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Crew</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
                {isSubmitting ? 'Criando...' : 'Criar Crew'}
            </button>
        </form>
    );
}
