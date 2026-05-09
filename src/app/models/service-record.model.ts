export enum ServiceType {
  CORTE = 'Corte',
  BARBA = 'Barba',
  CORTE_Y_BARBA = 'Corte y Barba',
  CEJAS = 'Cejas',
  TINTURA = 'Tintura',
  TRATAMIENTO_CAPILAR = 'Tratamiento Capilar',
  OTRO = 'Otro'
}

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
  serviceType: ServiceType;
  price: number;
  paymentMethod: PaymentMethod;
  date: Date;
  notes?: string;
}
