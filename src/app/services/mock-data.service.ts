import { Injectable } from '@angular/core';
import {
  UserModel,
  ServiceRecord,
  ServiceType,
  PaymentMethod
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  // ─── Empleados Mock ───────────────────────────────────────────
  private readonly employees: UserModel[] = [
    {
      id: 'emp-001',
      name: 'Marcos López',
      role: 'admin',
      specialty: 'Corte clásico',
      active: true,
      email: '',
      approved: false,
      createdAt: new Date()
    },
    {
      id: 'emp-002',
      name: 'Tomás Herrera',
      role: 'employee',
      specialty: 'Barba & Fade',
      active: true,
      email: '',
      approved: false,
      createdAt: new Date()
    },
    {
      id: 'emp-003',
      name: 'Lucas Martínez',
      role: 'employee',
      specialty: 'Tintura & Diseño',
      active: true,
      email: '',
      approved: false,
      createdAt: new Date()
    },
    {
      id: 'emp-004',
      name: 'Nicolás Ruiz',
      role: 'employee',
      specialty: 'Corte moderno',
      active: false,
      email: '',
      approved: false,
      createdAt: new Date()
    }
  ];

  // ─── Empleado actual simulado (sin auth) ──────────────────────
  private readonly currentEmployeeId = 'emp-001';

  // ─── Nombres de clientes para datos realistas ─────────────────
  private readonly clientNames = [
    'Juan Pérez', 'Carlos García', 'Martín Rodríguez',
    'Sebastián Díaz', 'Federico Torres', 'Alejandro Sánchez',
    'Pablo Fernández', 'Diego Romero', 'Matías Gómez',
    'Agustín Morales', 'Facundo Álvarez', 'Ignacio Ruiz',
    'Lautaro Castro', 'Santiago Flores', 'Gonzalo Medina'
  ];

  // ─── Precios por tipo de servicio ─────────────────────────────
  private readonly servicePrices: Record<ServiceType, number> = {
    [ServiceType.CORTE]: 8000,
    [ServiceType.BARBA]: 5000,
    [ServiceType.CORTE_Y_BARBA]: 12000,
    [ServiceType.CEJAS]: 3000,
    [ServiceType.TINTURA]: 15000,
    [ServiceType.TRATAMIENTO_CAPILAR]: 18000,
    [ServiceType.OTRO]: 7000
  };

  // ─── Registros de servicios mock ──────────────────────────────
  private serviceRecords: ServiceRecord[] = [];

  constructor() {
    this.generateMockRecords();
  }

  // ─── Getters ──────────────────────────────────────────────────

  getEmployees(): UserModel[] {
    return [...this.employees];
  }

  getActiveEmployees(): UserModel[] {
    return this.employees.filter(e => e.active);
  }

  getCurrentEmployee(): UserModel {
    return this.employees.find(e => e.id === this.currentEmployeeId)!;
  }

  getServiceRecords(): ServiceRecord[] {
    return [...this.serviceRecords];
  }

  getServicePrices(): Record<ServiceType, number> {
    return { ...this.servicePrices };
  }

  addServiceRecord(record: ServiceRecord): void {
    this.serviceRecords = [record, ...this.serviceRecords];
  }

  // ─── Generación de Datos Mock ─────────────────────────────────

  private generateMockRecords(): void {
    const now = new Date();
    const activeEmployees = this.employees.filter(e => e.active);
    const serviceTypes = Object.values(ServiceType);
    const paymentMethods = Object.values(PaymentMethod);

    // Generar registros para los últimos 7 días
    for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
      // Entre 3 y 6 servicios por día
      const servicesCount = this.randomInt(3, 6);

      for (let i = 0; i < servicesCount; i++) {
        const serviceType = this.randomItem(serviceTypes);
        const employee = this.randomItem(activeEmployees);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(this.randomInt(9, 20), this.randomInt(0, 59), 0, 0);

        // Variación de precio ±15% para realismo
        const basePrice = this.servicePrices[serviceType];
        const priceVariation = basePrice * (1 + (Math.random() * 0.3 - 0.15));
        const price = Math.round(priceVariation / 500) * 500; // Redondear a 500

        const record: ServiceRecord = {
          id: `srv-${daysAgo}-${i}-${Date.now()}`,
          employeeId: employee.id,
          employeeName: employee.name,
          clientName: Math.random() > 0.2
            ? this.randomItem(this.clientNames)
            : undefined,
          serviceType,
          price,
          paymentMethod: this.randomItem(paymentMethods),
          date,
          notes: Math.random() > 0.8
            ? this.generateRandomNote()
            : undefined
        };

        this.serviceRecords.push(record);
      }
    }

    // Ordenar por fecha más reciente primero
    this.serviceRecords.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private generateRandomNote(): string {
    const notes = [
      'Cliente habitual, descuento aplicado',
      'Primera visita',
      'Pidió turno para la próxima semana',
      'Servicio de urgencia',
      'Recomendado por otro cliente',
      'Pidió producto para llevar'
    ];
    return this.randomItem(notes);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
