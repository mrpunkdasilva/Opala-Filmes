'use client';

import { useState } from 'react';

export default function CreateTierListForm({ crewId, onSuccess, onError }) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            if (onError) onError('O nome da tier list é obrigatório.');
            return;
        }

        setIsSubmitting(true);
        if (onError) onError(''); // Clear previous errors

        try {
            const res = await fetch(`/api/crews/${crewId}/tierlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (res.ok) {
                if (onSuccess) {
                    onSuccess(data.message || 'Tier list criada com sucesso!');
                }
                setName('');
            } else {
                if (onError) {
                    onError(data.message || 'Ocorreu um erro ao criar a tier list.');
                }
            }
        } catch (err) {
            if (onError) {
                onError('Ocorreu um erro de conexão.');
            }
            console.error('Failed to create tier list:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Tier List</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
                {isSubmitting ? 'Criando...' : 'Criar Tier List'}
            </button>
        </form>
    );
}
