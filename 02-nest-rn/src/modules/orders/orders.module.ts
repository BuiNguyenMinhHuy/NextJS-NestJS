import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderDetail, OrderDetailSchema } from '../order.detail/schemas/order.detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderDetail.name, schema: OrderDetailSchema }
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }