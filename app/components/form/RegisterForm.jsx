'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Ocorreu um erro no registro.');
      } else {
        setSuccess('Usuário registrado com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 rounded-lg glass-dark border border-[var(--neon-green-dim)]">
      <h1 className="text-2xl font-bold text-center text-[var(--cosmic-white)]">Criar Conta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="text-sm font-medium text-[var(--neon-green)]">
            Nome de Usuário
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-[var(--cosmic-white)] bg-[var(--deep-space-light)] border border-[var(--neon-green-dim)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)]"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-[var(--neon-green)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-[var(--cosmic-white)] bg-[var(--deep-space-light)] border border-[var(--neon-green-dim)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)]"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-[var(--neon-green)]">
            Senha
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-[var(--cosmic-white)] bg-[var(--deep-space-light)] border border-[var(--neon-green-dim)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--neon-green)] hover:text-[var(--neon-green-alt)] focus:outline-none cursor-pointer"
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--neon-green)]">
            Confirmar Senha
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-[var(--cosmic-white)] bg-[var(--deep-space-light)] border border-[var(--neon-green-dim)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--neon-green)] hover:text-[var(--neon-green-alt)] focus:outline-none cursor-pointer"
              aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-center text-[var(--error)]">{error}</p>}
        {success && <p className="text-sm text-center text-[var(--success)]">{success}</p>}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-[var(--deep-space)] bg-[var(--neon-green)] rounded-md hover:bg-[var(--neon-green-alt)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--deep-space)] focus:ring-[var(--neon-green)] disabled:opacity-50 transition-all"
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-[var(--text-secondary)]">
        Já tem uma conta?{' '}
        <Link href="/login" className="font-medium text-[var(--neon-green)] hover:underline">
          Faça o login
        </Link>
      </p>
    </div>
  );
}
