import { Timestamp } from '@angular/fire/firestore';


// export enum ServiceType {
//   CORTE = 'Corte',
//   BARBA = 'Barba',
//   CORTE_Y_BARBA = 'Corte y Barba',
//   CEJAS = 'Cejas',
//   TINTURA = 'Tintura',
//   TRATAMIENTO_CAPILAR = 'Tratamiento Capilar',
//   OTRO = 'Otro'
// }

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
