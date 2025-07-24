import { z } from 'zod';
export const idParamSchema = z.object({ id: z.uuid() });
export type IdParamDto = z.infer<typeof idParamSchema>;
