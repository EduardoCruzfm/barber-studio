import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';
import { DatabaseService } from '../../services/database.service';
import { Service } from '../../models/service.model';
import { RecordItem } from '../../models/record-item.model';
import { PaymentMethod, ServiceRecord } from '../../models';
import { DashboardStats, ServiceRecordService } from '../../services/service-record.service';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent {

  showForm = false;
  services: Service[] = [];
  employees: any ;

  stats: DashboardStats = {
      totalServices: 0,
      totalRevenue: 0,
      averagePerService: 0,
      mostUsedPayment: PaymentMethod.EFECTIVO,
      revenueByPayment: [],
      revenueByService: [],
      revenueByEmployee: []
    };
  
    constructor(private db: DatabaseService, private serviceRecord: ServiceRecordService) {
      this.getServices();
      this.getRecords();
      this.getUsers();
    }

  records: RecordItem[] = [];
  todayRecords: ServiceRecord[] = [];
  
  newRecord: Partial<RecordItem> = {
    clientName: '',
    serviceName: '',
    employeeName: '',
    paymentMethod: 'Efectivo',
    price: 0,
    serviceId: ''
  };

   ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
      this.serviceRecord.getTodayRecords().subscribe(records => {
      this.todayRecords = records;
      this.stats = this.serviceRecord.getDashboardStats(records);
      console.log('todayrecods',records);
    });

  }

  getServices(){
      this.db.traerColeccion<Service>('services').subscribe((response) => {
        this.services = response ;
        console.log('Lista de servicios:', this.services);
      });
  }

  getRecords(){
      this.db.traerColeccion<RecordItem>('records').subscribe((response) => {
        this.records = response ;
        console.log('Lista de atenciones:', this.records);
      });
  }

  getUsers(){
    this.db.traerUsuario('users').subscribe((response) => {
      this.employees = response;
      console.log('Lista de empleados:', this.employees);
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async addRecord() {

    if (!this.newRecord.clientName || !this.newRecord.serviceName) return;

    const record: RecordItem = {
      id: Date.now().toString(),
      clientName: this.newRecord.clientName!,
      serviceName: this.newRecord.serviceName!,
      employeeName: this.newRecord.employeeName!,
      paymentMethod: this.newRecord.paymentMethod!,
      price: Number(this.newRecord.price),
      createdAt: new Date(),
      serviceId: this.newRecord.serviceId!
    };

    await this.db.agregarUsuario(record, 'records');

    console.log('atencion --->', record)
    this.records.unshift(record);

    this.newRecord = {
      clientName: '',
      serviceName: '',
      employeeName: '',
      paymentMethod: 'Efectivo',
      price: 0,
      serviceId:''
    };

    this.showForm = false;
  }

  onServiceChange() {
    const selectedService = this.services.find(
      service => service.name === this.newRecord.serviceName
    );

    if (selectedService) {
      this.newRecord.price = selectedService.price;
      this.newRecord.serviceId = selectedService.id;
    }
  }
}