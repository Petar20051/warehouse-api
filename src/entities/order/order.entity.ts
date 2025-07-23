import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../company/company.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Partner } from '../partner/partner.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from '../user/user.entity';

export type OrderType = 'shipment' | 'delivery';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.orders)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @Column({ type: 'enum', enum: ['shipment', 'delivery'] })
  orderType!: OrderType;

  @Column({ type: 'uuid', nullable: true })
  partnerId!: string | null;

  @ManyToOne(() => Partner, (partner) => partner.orders, { nullable: true })
  @JoinColumn({ name: 'partner_id' })
  partner!: Partner;

  @Column({ type: 'uuid' })
  warehouseId!: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.orders)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by_user_id' })
  modifiedBy?: User;
}
