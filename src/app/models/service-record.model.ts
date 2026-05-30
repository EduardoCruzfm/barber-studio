import { Timestamp } from '@angular/fire/firestore';

export enum PaymentMethod {
  EFECTIVO = 'Efectivo',
  TARJETA = 'Tarjeta',
  TRANSFERENCIA = 'Transferencia',
  MERCADOPAGO = 'MercadoPago'
}

export interface ServiceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  clientName?: string;
  serviceName: string;
  price: number;
  paymentMethod: PaymentMethod;
  createdAt: Timestamp;
  notes?: string;
}
