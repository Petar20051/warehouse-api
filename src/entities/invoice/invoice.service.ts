import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseService } from '../../common/services/base.service';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceService extends BaseService<Invoice> {
  constructor(@InjectRepository(Invoice) repo: Repository<Invoice>) {
    super(repo);
  }
}
