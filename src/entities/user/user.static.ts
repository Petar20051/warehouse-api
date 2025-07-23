export enum UserRole {
  OWNER = 'owner',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole),
  companyId: z.uuid(),
});

export const updateUserSchema = createUserSchema.partial();

export const userIdParamSchema = z.object({
  id: z.uuid(),
});
