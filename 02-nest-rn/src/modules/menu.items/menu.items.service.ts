// src/modules/menu.items/menu.items.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu.item.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItem>
  ) { }

  async create(createMenuItemDto: CreateMenuItemDto) {
    return await this.menuItemModel.create({ ...createMenuItemDto as any });
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.menuItemModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);

    const results = await this.menuItemModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate({
        path: 'menu',
        select: 'title',
        populate: { path: 'restaurant', select: 'name' } // Lấy tiếp thông tin nhà hàng từ Menu
      });

    return {
      meta: { current, pageSize, pages: totalPages, total: totalItems },
      results
    }
  }

  async update(updateMenuItemDto: UpdateMenuItemDto) {
    return await this.menuItemModel.updateOne(
      { _id: updateMenuItemDto._id }, { ...updateMenuItemDto }
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.menuItemModel.deleteOne({ _id });
    }
    throw new BadRequestException("Id không đúng định dạng");
  }
}