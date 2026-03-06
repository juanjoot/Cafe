import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ProductsService } from '../services/products.service';
import { CreateCoffeeDto } from '../dto/create-coffee.dto';
import { UpdateCoffeeDto } from '../dto/update-coffee.dto';

@Controller()
export class ProductMessageController {
  constructor(private readonly products: ProductsService) {}

  @MessagePattern('product.create')
  async create(dto: CreateCoffeeDto) {
    try {
      return await this.products.create(dto);
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'product.create failed');
    }
  }

  @MessagePattern('product.findAll')
  async findAll() {
    try {
      return await this.products.findAll();
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'product.findAll failed');
    }
  }

  @MessagePattern('product.findById')
  async findById(dto: { id: string }) {
    try {
      return await this.products.findById(dto.id);
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'product.findById failed');
    }
  }

  @MessagePattern('product.update')
  async update(dto: { id: string; data: UpdateCoffeeDto }) {
    try {
      return await this.products.update(dto.id, dto.data);
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'product.update failed');
    }
  }

  @MessagePattern('product.remove')
  async remove(dto: { id: string }) {
    try {
      return await this.products.remove(dto.id);
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'product.remove failed');
    }
  }
}