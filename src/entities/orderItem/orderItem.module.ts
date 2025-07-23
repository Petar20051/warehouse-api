import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './orderItem.entity';
import { OrderItemService } from './orderItem.service';
import { OrderItemController } from './orderItem.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  providers: [OrderItemService],
  controllers: [OrderItemController],
  exports: [OrderItemService],
})
export class OrderItemModule {}
