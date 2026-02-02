import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuItemOptionDto } from './dto/create-menu.item.option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu.item.option.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItemOption } from './schemas/menu.item.option.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class MenuItemOptionsService {
  constructor(
    @InjectModel(MenuItemOption.name)
    private menuItemOptionModel: Model<MenuItemOption>
  ) { }

  async create(createMenuItemOptionDto: CreateMenuItemOptionDto) {
    return await this.menuItemOptionModel.create({ ...createMenuItemOptionDto });
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.menuItemOptionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);

    const results = await this.menuItemOptionModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate('menuItem', 'title'); // Lấy tên món ăn để hiển thị

    return {
      meta: { current, pageSize, pages: totalPages, total: totalItems },
      results
    }
  }

  async update(updateMenuItemOptionDto: UpdateMenuItemOptionDto) {
    return await this.menuItemOptionModel.updateOne(
      { _id: updateMenuItemOptionDto._id }, { ...updateMenuItemOptionDto }
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.menuItemOptionModel.deleteOne({ _id });
    }
    throw new BadRequestException("Id không đúng định dạng");
  }
}