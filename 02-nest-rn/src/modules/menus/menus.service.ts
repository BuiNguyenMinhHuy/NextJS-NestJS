import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from './schemas/menu.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: Model<Menu>
  ) { }

  async create(createMenuDto: CreateMenuDto) {
    return await this.menuModel.create({ ...createMenuDto });
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.menuModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);

    const results = await this.menuModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate('restaurant', 'name');

    return {
      meta: { current, pageSize, pages: totalPages, total: totalItems },
      results
    }
  }

  async update(updateMenuDto: UpdateMenuDto) {
    return await this.menuModel.updateOne(
      { _id: updateMenuDto._id }, { ...updateMenuDto }
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.menuModel.deleteOne({ _id });
    }
    throw new BadRequestException("Id không đúng định dạng");
  }
}