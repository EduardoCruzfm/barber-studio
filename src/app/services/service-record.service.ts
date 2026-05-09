import { Injectable } from '@angular/core';
import {
  ServiceRecord,
  ServiceType,
  PaymentMethod,
  UserModel
} from '../models';
import { MockDataService } from './mock-data.service';

export interface ServiceFilters {
  dateFrom?: Date;
  dateTo?: Date;
  employeeId?: string;
  paymentMethod?: PaymentMethod;
  serviceType?: ServiceType;
}

export interface DashboardStats {
  totalServices: number;
  totalRevenue: number;
  averagePerService: number;
  mostUsedPayment: PaymentMethod;
  revenueByPayment: { method: PaymentMethod; total: number; count: number }[];
  revenueByService: { type: ServiceType; total: number; count: number }[];
  revenueByEmployee: { employee: string; total: number; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ServiceRecordService {

  constructor(private mockData: MockDataService) {}

  // ─── CRUD ─────────────────────────────────────────────────────

  /**
   * Obtiene todos los registros de servicio, ordenados por fecha desc.
   */
  getAll(): ServiceRecord[] {
    return this.mockData.getServiceRecords();
  }

  /**
   * Agrega un nuevo registro de servicio.
   * Genera un ID único y asigna el empleado actual.
   */
  addRecord(data: Omit<ServiceRecord, 'id' | 'employeeId' | 'employeeName'>): ServiceRecord {
    const currentEmployee = this.mockData.getCurrentEmployee();
    const record: ServiceRecord = {
      ...data,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name
    };
    this.mockData.addServiceRecord(record);
    return record;
  }

  // ─── Queries con Filtros ──────────────────────────────────────

  /**
   * Obtiene registros filtrados según los criterios proporcionados.
   */
  getFiltered(filters: ServiceFilters): ServiceRecord[] {
    let records = this.getAll();

    if (filters.dateFrom) {
      const from = this.startOfDay(filters.dateFrom);
      records = records.filter(r => r.date >= from);
    }

    if (filters.dateTo) {
      const to = this.endOfDay(filters.dateTo);
      records = records.filter(r => r.date <= to);
    }

    if (filters.employeeId) {
      records = records.filter(r => r.employeeId === filters.employeeId);
    }

    if (filters.paymentMethod) {
      records = records.filter(r => r.paymentMethod === filters.paymentMethod);
    }

    if (filters.serviceType) {
      records = records.filter(r => r.serviceType === filters.serviceType);
    }

    return records;
  }

  /**
   * Obtiene los registros de hoy.
   */
  getTodayRecords(): ServiceRecord[] {
    const today = new Date();
    return this.getFiltered({
      dateFrom: today,
      dateTo: today
    });
  }

  /**
   * Obtiene registros por fecha específica.
   */
  getByDate(date: Date): ServiceRecord[] {
    return this.getFiltered({
      dateFrom: date,
      dateTo: date
    });
  }

  /**
   * Obtiene registros de un empleado específico.
   */
  getByEmployee(employeeId: string): ServiceRecord[] {
    return this.getFiltered({ employeeId });
  }

  /**
   * Obtiene registros por método de pago.
   */
  getByPaymentMethod(method: PaymentMethod): ServiceRecord[] {
    return this.getFiltered({ paymentMethod: method });
  }

  // ─── Estadísticas para Dashboard ──────────────────────────────

  /**
   * Calcula todas las estadísticas del dashboard para un conjunto de registros.
   * Si no se pasan registros, usa los de hoy.
   */
  getDashboardStats(records?: ServiceRecord[]): DashboardStats {
    const data = records ?? this.getTodayRecords();

    const totalServices = data.length;
    const totalRevenue = data.reduce((sum, r) => sum + r.price, 0);
    const averagePerService = totalServices > 0
      ? Math.round(totalRevenue / totalServices)
      : 0;

    // Agrupar por método de pago
    const revenueByPayment = this.groupByPayment(data);

    // Método más usado
    const mostUsedPayment = revenueByPayment.length > 0
      ? revenueByPayment.reduce((max, curr) =>
          curr.count > max.count ? curr : max
        ).method
      : PaymentMethod.EFECTIVO;

    // Agrupar por tipo de servicio
    const revenueByService = this.groupByServiceType(data);

    // Agrupar por empleado
    const revenueByEmployee = this.groupByEmployee(data);

    return {
      totalServices,
      totalRevenue,
      averagePerService,
      mostUsedPayment,
      revenueByPayment,
      revenueByService,
      revenueByEmployee
    };
  }

  /**
   * Obtiene el total recaudado hoy.
   */
  getTodayTotal(): number {
    return this.getTodayRecords().reduce((sum, r) => sum + r.price, 0);
  }

  /**
   * Resumen de recaudación del día por método de pago.
   */
  getTodayByPayment(): { method: PaymentMethod; total: number; count: number }[] {
    return this.groupByPayment(this.getTodayRecords());
  }

  // ─── Datos de Referencia ──────────────────────────────────────

  /**
   * Obtiene la lista de empleados activos.
   */
  getActiveEmployees(): UserModel[] {
    return this.mockData.getActiveEmployees();
  }

  /**
   * Obtiene todos los empleados.
   */
  getAllEmployees(): UserModel[] {
    return this.mockData.getEmployees();
  }

  /**
   * Obtiene el empleado actualmente logueado (simulado).
   */
  getCurrentEmployee(): UserModel {
    return this.mockData.getCurrentEmployee();
  }

  /**
   * Obtiene los precios sugeridos por tipo de servicio.
   */
  getServicePrices(): Record<ServiceType, number> {
    return this.mockData.getServicePrices();
  }

  /**
   * Obtiene todos los tipos de servicio disponibles.
   */
  getServiceTypes(): ServiceType[] {
    return Object.values(ServiceType);
  }

  /**
   * Obtiene todos los métodos de pago disponibles.
   */
  getPaymentMethods(): PaymentMethod[] {
    return Object.values(PaymentMethod);
  }

  // ─── Utilidades Privadas ──────────────────────────────────────

  private groupByPayment(records: ServiceRecord[]): { method: PaymentMethod; total: number; count: number }[] {
    const map = new Map<PaymentMethod, { total: number; count: number }>();

    for (const record of records) {
      const current = map.get(record.paymentMethod) ?? { total: 0, count: 0 };
      current.total += record.price;
      current.count += 1;
      map.set(record.paymentMethod, current);
    }

    return Array.from(map.entries())
      .map(([method, data]) => ({ method, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  private groupByServiceType(records: ServiceRecord[]): { type: ServiceType; total: number; count: number }[] {
    const map = new Map<ServiceType, { total: number; count: number }>();

    for (const record of records) {
      const current = map.get(record.serviceType) ?? { total: 0, count: 0 };
      current.total += record.price;
      current.count += 1;
      map.set(record.serviceType, current);
    }

    return Array.from(map.entries())
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  private groupByEmployee(records: ServiceRecord[]): { employee: string; total: number; count: number }[] {
    const map = new Map<string, { total: number; count: number }>();

    for (const record of records) {
      const current = map.get(record.employeeName) ?? { total: 0, count: 0 };
      current.total += record.price;
      current.count += 1;
      map.set(record.employeeName, current);
    }

    return Array.from(map.entries())
      .map(([employee, data]) => ({ employee, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}
