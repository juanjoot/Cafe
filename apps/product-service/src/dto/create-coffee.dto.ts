export class CreateCoffeeDto {
  name: string;
  origin: string;
  tastingNotes?: string[];
  price: number;
  stock: number;
}
