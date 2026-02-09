import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) { }

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    // Chuyển đổi current và pageSize từ string sang number bằng dấu +
    return this.menusService.findAll(query, +current, +pageSize);
  }



  @Patch(':id')
  @ResponseMessage("Cập nhật menu thành công")
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
