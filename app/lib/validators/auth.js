import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string({
    required_error: 'O nome de usuário é obrigatório.',
  }).min(3, 'O nome de usuário deve ter no mínimo 3 caracteres.').max(30, 'O nome de usuário deve ter no máximo 30 caracteres.'),
  
  email: z.string({
    required_error: 'O email é obrigatório.',
  }).email('Formato de email inválido.'),
  
  password: z.string({
    required_error: 'A senha é obrigatória.',
  }).min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
