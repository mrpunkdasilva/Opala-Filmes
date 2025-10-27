'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError('Email ou senha inválidos. Tente novamente.');
        setIsLoading(false);
      } else {
        router.push('/'); // Redireciona para a home em caso de sucesso
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente mais tarde.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 rounded-lg glass-dark border border-[var(--neon-green-dim)]">
      <h1 className="text-2xl font-bold text-center text-[var(--cosmic-white)]">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              autoComplete="current-password"
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

        {error && (
          <p className="text-sm text-center text-[var(--error)]">{error}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-[var(--deep-space)] bg-[var(--neon-green)] rounded-md hover:bg-[var(--neon-green-alt)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--deep-space)] focus:ring-[var(--neon-green)] disabled:opacity-50 transition-all"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-[var(--text-secondary)]">
        Não tem uma conta?{' '}
        <Link href="/register" className="font-medium text-[var(--neon-green)] hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
