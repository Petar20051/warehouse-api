import { z } from 'zod';
import { InvoiceStatus } from './invoice.entity';
import { createZodDto } from 'nestjs-zod';

export const createInvoiceSchema = z.object({
  orderId: z.uuid(),
  invoiceNumber: z.string(),
  status: z.enum(InvoiceStatus),
  date: z.coerce.date(),
});
export const updateInvoiceSchema = createInvoiceSchema.partial();

export class CreateInvoiceDto extends createZodDto(createInvoiceSchema) {}
export class UpdateInvoiceDto extends createZodDto(updateInvoiceSchema) {}
