import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject('product-service') private readonly productClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateCoffeeDto) {
    return await firstValueFrom(this.productClient.send('product.create', dto));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await firstValueFrom(this.productClient.send('product.findAll', {}));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await firstValueFrom(this.productClient.send('product.findById', { id }));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateCoffeeDto) {
    return await firstValueFrom(this.productClient.send('product.update', { id, data }));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await firstValueFrom(this.productClient.send('product.remove', { id }));
  }
}
