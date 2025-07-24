import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Invoice } from './invoice.entity';
import { AuthUser } from 'src/common/types/auth-user';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class InvoiceService extends BaseService<Invoice> {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {
    super(invoiceRepo);
  }

  private async findOneSecure(
    id: string,
    companyId: string,
  ): Promise<Invoice | null> {
    return this.invoiceRepo.findOne({
      where: {
        id,
        order: {
          company: { id: companyId },
        },
      },
      relations: ['order', 'order.company'],
    });
  }

  override async findOne(
    id: string,
    companyId: string,
  ): Promise<Invoice | null> {
    return this.findOneSecure(id, companyId);
  }

  override async updateWithUserContext(
    id: string,
    dto: DeepPartial<Invoice>,
    user: AuthUser,
  ): Promise<Invoice | null> {
    const existing = await this.findOneSecure(id, user.companyId);
    if (!existing)
      throw new ForbiddenException('Invoice not found or access denied');

    const updated = this.invoiceRepo.merge(existing, {
      ...dto,
      modifiedByUserId: user.userId,
    });

    return this.invoiceRepo.save(updated);
  }

  override async softDelete(id: string, companyId: string): Promise<void> {
    const existing = await this.findOneSecure(id, companyId);
    if (!existing)
      throw new ForbiddenException('Invoice not found or access denied');

    await this.invoiceRepo.softDelete({ id });
  }

  override async hardDelete(id: string, companyId: string): Promise<void> {
    const existing = await this.findOneSecure(id, companyId);
    if (!existing)
      throw new ForbiddenException('Invoice not found or access denied');

    await this.invoiceRepo.delete({ id });
  }
}
