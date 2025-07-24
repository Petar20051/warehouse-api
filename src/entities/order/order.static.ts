import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createOrderSchema = z.object({
  warehouseId: z.string().uuid(),
  partnerId: z.string().uuid().optional(),
  orderType: z.enum(['shipment', 'delivery']),
  notes: z.string().optional(),
  date: z.coerce.date(),
});
export const updateOrderSchema = createOrderSchema.partial();

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
