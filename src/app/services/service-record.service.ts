import { Injectable } from '@angular/core';
import {
  ServiceRecord,
  
  PaymentMethod,
  UserModel
} from '../models';
import { DatabaseService } from './database.service';
import { Observable, map, combineLatest} from 'rxjs';

export interface ServiceFilters {
  dateFrom?: Date;
  dateTo?: Date;
  employeeId?: string;
  paymentMethod?: PaymentMethod;
  serviceType?: string;
}

export interface DashboardStats {
  totalServices: number;
  totalRevenue: number;
  averagePerService: number;
  mostUsedPayment: PaymentMethod;
  revenueByPayment: { method: PaymentMethod; total: number; count: number }[];
  revenueByService: { type: string; total: number; count: number }[];
  revenueByEmployee: { employee: string; total: number; count: number }[];
}

export interface EmployeeSummary {
  employeeId: string;
  employee: string;
  total: number;
  count: number;
}

export interface MonthlyReport {
  totalRevenue: number;
  totalServices: number;
  averagePerService: number;

  topEmployee: EmployeeSummary;

  revenueByEmployee: EmployeeSummary[];
}

export interface EmployeeSettlement {
  employeeId: string;
  employee: string;
  totalRevenue: number;
  totalServices: number;
  commission: number;
  totalToPay: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceRecordService {

  constructor(private db: DatabaseService ) {}

  // ─── CRUD ─────────────────────────────────────────────────────

  /**
   * Obtiene todos los registros de servicio, ordenados por fecha desc.
   */
  getAll(): Observable <ServiceRecord[]> {
    return this.db.traerColeccion<ServiceRecord>('records');
  }

  // ─── Queries con Filtros ──────────────────────────────────────

  /**
   * Obtiene registros filtrados según los criterios proporcionados.
   */
  getFiltered(filters: ServiceFilters): Observable<ServiceRecord[]> {

  return this.getAll().pipe(

    map(records => {

      let filtered = records;

      if (filters.dateFrom) {
        const from = this.startOfDay(filters.dateFrom);

        filtered = filtered.filter(
          (r: ServiceRecord) => r.createdAt.toDate() >= from
        );
      }

      if (filters.dateTo) {
        const to = this.endOfDay(filters.dateTo);

        filtered = filtered.filter(
          (r: ServiceRecord) => r.createdAt.toDate() <= to
        );
      }

      if (filters.employeeId) {
        filtered = filtered.filter(
          (r: ServiceRecord) => r.employeeId === filters.employeeId
        );
      }

      if (filters.paymentMethod) {
        filtered = filtered.filter(
          (r: ServiceRecord) => r.paymentMethod === filters.paymentMethod
        );
      }

      if (filters.serviceType) {
        filtered = filtered.filter(
          (r: ServiceRecord) => r.serviceName === filters.serviceType
        );
      }

      return filtered;

    })

  );

}

  /**
   * Obtiene los registros de hoy.
   */
  getTodayRecords(): Observable<ServiceRecord[]> {
    const today = new Date();

    return this.getFiltered({
      dateFrom: today,
      dateTo: today
    });
  }

  /**
   * Obtiene registros por fecha específica.
   */
  getByDate(date: Date): Observable<ServiceRecord[]> {
    return this.getFiltered({
      dateFrom: date,
      dateTo: date
    });
  }

  /**
   * Obtiene registros de un empleado específico.
   */
  getByEmployee(employeeId: string): Observable<ServiceRecord[]> {
    return this.getFiltered({ employeeId });
  }
  /**
   * Obtiene registros por método de pago.
   */
  getByPaymentMethod(method: PaymentMethod): Observable<ServiceRecord[]> {
    return this.getFiltered({ paymentMethod: method });
  }

  // ─── Estadísticas para Dashboard ──────────────────────────────

  /**
   * Calcula todas las estadísticas del dashboard para un conjunto de registros.
   * Si no se pasan registros, usa los de hoy.
   */
  getDashboardStats(records: ServiceRecord[]): DashboardStats {
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
      revenueByEmployee,      
    };

  }

  /**
   * Obtiene el total recaudado hoy.
   */
  getTodayTotal(): Observable<number> {
    return this.getTodayRecords().pipe(
      map((records: ServiceRecord[]) =>
        records.reduce(
          (sum: number, r: ServiceRecord) => sum + r.price,
          0
        )
      )
    );
  }

  /**
   * Resumen de recaudación del día por método de pago.
   */
  getTodayByPayment(): Observable<
  { method: PaymentMethod; total: number; count: number }[]> {
    return this.getTodayRecords().pipe(
      map((records: ServiceRecord[]) =>
        this.groupByPayment(records)
      )
    );
  }

  /**
   * Obtiene todos los métodos de pago disponibles.
   */
  getPaymentMethods(): PaymentMethod[] {
    return Object.values(PaymentMethod);
  }

  // ─── Reportes ──────────────────────────────────────


  getCurrentMonthReport(): Observable<MonthlyReport> {

  return this.getCurrentMonthRecords().pipe(

    map((records: ServiceRecord[]) => {

      const revenueByEmployee = this.groupByEmployee(records);

      const totalRevenue = records.reduce(
        (sum, record) => sum + record.price,
        0
      );

      const totalServices = records.length;

      const averagePerService =
        totalServices > 0
          ? Math.round(totalRevenue / totalServices)
          : 0;

      const topEmployee =
        revenueByEmployee.length > 0
          ? revenueByEmployee[0]
          : {
              employeeId: '',
              employee: '',
              total: 0,
              count: 0
            };

      return {
        totalRevenue,
        totalServices,
        averagePerService,
        topEmployee,
        revenueByEmployee
      };

    })

  );
}

private calculateSettlement(
  records: ServiceRecord[],
  users: UserModel[]
): EmployeeSettlement[] {

  
  const map = new Map<string, EmployeeSettlement>();

  for (const record of records) {

    const employeeData = users.find(
      u => u.id === record.employeeId
      );
    
    const commission = employeeData?.commission ?? 0;

    const current = map.get(record.employeeId) ?? {
      employeeId: record.employeeId,
      employee: record.employeeName,
      totalRevenue: 0,
      totalServices: 0,
      commission,
      totalToPay: 0
    };

    current.totalRevenue += record.price;
    current.totalServices++;

    map.set(record.employeeId, current);
  }

  return Array.from(map.values()).map(employee => ({
    ...employee,
    totalToPay: employee.totalRevenue * (employee.commission / 100)
  }));
}

 getEmployeesDailySettlement(): Observable<EmployeeSettlement[]> {

  return combineLatest([
    this.getTodayRecords(),
    this.db.traerColeccion<UserModel>('users')
  ]).pipe(

    map(([records, users]) =>
      this.calculateSettlement(records, users)
    )

  );

}

  // getEmployeesWeeklySettlement(commission: number): Observable<EmployeeSettlement[]> {
  //   return this.getCurrentWeekRecords().pipe(
  //     map(records => this.calculateSettlement(records, commission))
  //   );
  // }

  getEmployeesMonthlySettlement(): Observable<EmployeeSettlement[]> {

  return combineLatest([
    this.getCurrentMonthRecords(),
    this.db.traerColeccion<UserModel>('users')
  ]).pipe(

    map(([records, users]) =>
      this.calculateSettlement(records, users)
    )

  );
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

  private groupByServiceType(records: ServiceRecord[]): { type: string; total: number; count: number }[] {
    const map = new Map<string, { total: number; count: number }>();

    for (const record of records) {
      const current = map.get(record.serviceName) ?? { total: 0, count: 0 };
      current.total += record.price;
      current.count += 1;
      map.set(record.serviceName, current);
    }

    return Array.from(map.entries())
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.total - a.total);
  }

    private groupByEmployee(
    records: ServiceRecord[]
  ): EmployeeSummary[] {

    const map = new Map<string, EmployeeSummary>();

    for (const record of records) {

      const current =
        map.get(record.employeeId) ?? {
          employeeId: record.employeeId,
          employee: record.employeeName,
          total: 0,
          count: 0
        };

      current.total += record.price;
      current.count++;

      map.set(record.employeeId, current);
    }

    return Array.from(map.values())
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

  
  /**
   * Obtiene registros del mes actual.
   */
  getCurrentMonthRecords(): Observable<ServiceRecord[]> {

    const today = new Date();

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const end = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    return this.getFiltered({
      dateFrom: start,
      dateTo: end
    });

  }
}
