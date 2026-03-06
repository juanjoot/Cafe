import { IsArray, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  origin: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tastingNotes?: string[];

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}