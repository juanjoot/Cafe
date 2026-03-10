import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import type { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject('order-service') private readonly orderClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const user = (req as any).user;
    const userId = user.sub;

    return await firstValueFrom(
      this.orderClient.send('order.create', {
        userId,
        items: dto.items,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await firstValueFrom(this.orderClient.send('order.findById', { id }));
  }
}