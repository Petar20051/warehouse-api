export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'supersecret',
};

export const AuthMessages = {
  invalidCredentials: 'Invalid email or password',
};

import { z } from 'zod';

export const RegisterSchema = z.object({
  companyName: z.string().min(2),
  companyEmail: z.string().email(),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterUserToCompanySchema = z.object({
  companyId: z.string().uuid(),
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
