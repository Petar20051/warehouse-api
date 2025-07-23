import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const companyIdParamSchema = z.object({
  id: z.uuid(),
});
