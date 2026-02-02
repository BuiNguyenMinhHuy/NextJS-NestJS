import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MenuItemOptionsService } from './menu.item.options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu.item.option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu.item.option.dto';
import { ResponseMessage } from '@/decorator/customize';

@Controller('menu-item-options')
export class MenuItemOptionsController {
  constructor(private readonly menuItemOptionsService: MenuItemOptionsService) { }

  @Post()
  @ResponseMessage("Tạo mới tùy chọn món ăn thành công")
  create(@Body() createMenuItemOptionDto: CreateMenuItemOptionDto) {
    return this.menuItemOptionsService.create(createMenuItemOptionDto);
  }

  @Get()
  @ResponseMessage("Lấy danh sách tùy chọn món ăn thành công")
  async findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.menuItemOptionsService.findAll(query, +current, +pageSize);
  }

  @Patch()
  @ResponseMessage("Cập nhật tùy chọn món ăn thành công")
  update(@Body() updateMenuItemOptionDto: UpdateMenuItemOptionDto) {
    return this.menuItemOptionsService.update(updateMenuItemOptionDto);
  }

  @Delete(':id')
  @ResponseMessage("Xóa tùy chọn món ăn thành công")
  remove(@Param('id') id: string) {
    return this.menuItemOptionsService.remove(id);
  }
}