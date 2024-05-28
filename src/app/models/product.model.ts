export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  [key: string]: string | number;
}
