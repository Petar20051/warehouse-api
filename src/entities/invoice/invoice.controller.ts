import { Controller } from '@nestjs/common';

import { BaseController } from 'src/common/controller/base.controller';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController extends BaseController<Invoice> {
  constructor(private readonly invoiceService: InvoiceService) {
    super(invoiceService);
  }
}
