import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { CardComponent } from '../shared/card/card.component';
import { TableComponent, TableColumn } from '../shared/table/table.component';
import { ServiceRecordService, DashboardStats } from '../../services/service-record.service';
import { ServiceRecord, PaymentMethod } from '../../models';
import { DatabaseService } from '../../services/database.service';
import { RecordItem } from '../../models/record-item.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, CardComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats!: DashboardStats;
  todayRecords: ServiceRecord[] = [];
  records: RecordItem[] = [];

  tableColumns: TableColumn[] = [
    { key: 'employeeName', label: 'Empleado' },
    { key: 'clientName', label: 'Cliente' },
    { key: 'serviceName', label: 'Servicio' },
    { key: 'price', label: 'Precio', format: 'currency' },
    { key: 'paymentMethod', label: 'Pago' },
    { key: 'createdAt', label: 'Hora', format: 'time' }
  ];

  constructor(private db: DatabaseService ,private serviceRecord: ServiceRecordService) {
    this.getRecords();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.todayRecords = this.serviceRecord.getTodayRecords();
    this.stats = this.serviceRecord.getDashboardStats(this.todayRecords);
  }

  getRecords(){
      this.db.traerColeccion<RecordItem>('records').subscribe((response) => {
        this.records = response ;
        console.log('Lista de atenciones:', this.records);
      });
  }

  formatCurrency(value: number): string {
    return `$ ${value.toLocaleString('es-AR')}`;
  }

  getPaymentIcon(method: PaymentMethod): string {
    const icons: Record<string, string> = {
      'Efectivo': '💵',
      'Tarjeta': '💳',
      'Transferencia': '🏦',
      'MercadoPago': '📱'
    };
    return icons[method] || '💰';
  }
}
