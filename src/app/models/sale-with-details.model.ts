import { SaleDetail } from './sale-detail.model';

export interface SaleWithDetails {
  date: string; // Asegúrate de que esta propiedad está definida como string
  saleDetails: SaleDetail[];
}
