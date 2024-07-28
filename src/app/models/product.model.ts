import { SafeUrl } from '@angular/platform-browser';

export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  totalQuantity?: number;
  imageUrl?: SafeUrl; // URL de la imagen sanitizada
  [key: string]: string | number | undefined | SafeUrl; // Añadido para permitir el filtrado genérico
}
