import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>
  ) { }

  async create(createRestaurantDto: CreateRestaurantDto) {
    return await this.restaurantModel.create({ ...createRestaurantDto });
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.restaurantModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);

    const results = await this.restaurantModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: { current, pageSize, pages: totalPages, total: totalItems },
      results
    }
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
    return await this.restaurantModel.updateOne(
      { _id: updateRestaurantDto._id }, { ...updateRestaurantDto }
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.restaurantModel.deleteOne({ _id });
    }
    throw new BadRequestException("Id không đúng định dạng");
  }

  async findOne(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.restaurantModel.findById(_id);
    }
    throw new BadRequestException("Id không đúng định dạng");
  }
}