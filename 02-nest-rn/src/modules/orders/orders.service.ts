import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import aqp from 'api-query-params';
import { OrderDetail } from '../order.detail/schemas/order.detail.schema';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderDetail.name) private orderDetailModel: Model<OrderDetail>,
  ) { }
  async create(createOrderDto: any, user: any) {
    const { restaurant, detail, totalPrice } = createOrderDto;

    // 1. Lưu thông tin đơn hàng tổng quát
    const order = await this.orderModel.create({
      restaurant,
      user: user._id,
      totalPrice,
      status: 'PENDING',
      orderTime: new Date()
    });

    // 2. Lưu danh sách món ăn chi tiết
    if (order) {
      const details = detail.map((item: any) => ({
        order: order._id,
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: item.price
      }));
      await this.orderDetailModel.insertMany(details);
    }

    return order;
  }

  async findAll(query: any, current: number, pageSize: number, user: any) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    // Quan trọng: Chỉ lấy đơn hàng thuộc về user đang đăng nhập
    filter['user'] = user._id;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);

    const results = await this.orderModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate('restaurant', 'name'); // Lấy tên nhà hàng để hiển thị ở danh sách

    return {
      meta: { current, pageSize, pages: totalPages, total: totalItems },
      results
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
