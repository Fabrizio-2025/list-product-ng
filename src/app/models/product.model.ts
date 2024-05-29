export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  totalQuantity?: number;
  [key: string]: string | number | undefined;
}
