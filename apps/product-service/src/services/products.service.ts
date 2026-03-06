import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coffee, CoffeeDocument } from '../schemas/coffee.schema';
import { CreateCoffeeDto } from '../dto/create-coffee.dto';
import { UpdateCoffeeDto } from '../dto/update-coffee.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Coffee.name) private readonly coffeeModel: Model<CoffeeDocument>) {}

  async create(dto: CreateCoffeeDto) {
    const created = new this.coffeeModel({
      name: dto.name,
      origin: dto.origin,
      tastingNotes: dto.tastingNotes ?? [],
      price: dto.price,
      stock: dto.stock,
      active: true,
    });
    const saved = await created.save();
    return this.toPublic(saved);
  }

  async findAll() {
    const docs = await this.coffeeModel.find({ active: true }).sort({ createdAt: -1 }).exec();
    return docs.map((d) => this.toPublic(d));
  }

  async findById(id: string) {
    const doc = await this.coffeeModel.findById(id).exec();
    if (!doc) throw new Error('Coffee not found');
    return this.toPublic(doc);
  }

  async update(id: string, dto: UpdateCoffeeDto) {
    const updated = await this.coffeeModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new Error('Coffee not found');
    return this.toPublic(updated);
  }

  async remove(id: string) {
    const updated = await this.coffeeModel
      .findByIdAndUpdate(id, { active: false }, { new: true })
      .exec();
    if (!updated) throw new Error('Coffee not found');
    return { ok: true };
  }

  private toPublic(doc: CoffeeDocument) {
    return {
      id: doc._id.toString(),
      name: doc.name,
      origin: doc.origin,
      tastingNotes: doc.tastingNotes,
      price: doc.price,
      stock: doc.stock,
      active: doc.active,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}