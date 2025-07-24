import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createOrderItemSchema = z.object({
  orderId: z.uuid(),
  productId: z.uuid(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
});
export const updateOrderItemSchema = createOrderItemSchema.partial();

export class CreateOrderItemDto extends createZodDto(createOrderItemSchema) {}
export class UpdateOrderItemDto extends createZodDto(updateOrderItemSchema) {}
