import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';
import { DatabaseService } from '../../services/database.service';
import { Service } from '../../models/service.model';

interface RecordItem {
  id: string;
  client: string;
  serviceId: string
  serviceName: string
  employee: string;
  payment: string;
  amount: number;
  createdAt: Date;
}

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
  
    constructor(private db: DatabaseService) {
      this.getServices();
      this.getRecords();
      this.getUsers();
    }

  records: RecordItem[] = [
    // {
    //   id: '1',
    //   client: 'Juan Pérez',
    //   serviceId: '',
    //   serviceName: 'Corte clásico',
    //   employee: 'Marcos',
    //   payment: 'Efectivo',
    //   amount: 8000,
    //   createdAt: new Date()
    // }
  ];

  newRecord: Partial<RecordItem> = {
    client: '',
    serviceName: '',
    employee: '',
    payment: 'Efectivo',
    amount: 0,
    serviceId: ''
  };

  getServices(){
      this.db.traerColeccion<Service>('services').subscribe((response) => {
        this.services = response ;
        console.log('Lista de servicios:', this.services);
      });
  }

  getRecords(){
      this.db.traerColeccion<RecordItem>('records').subscribe((response) => {
        this.records = response ;
        console.log('Lista de atenciones:', this.services);
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

    if (!this.newRecord.client || !this.newRecord.serviceName) return;

    const record: RecordItem = {
      id: Date.now().toString(),
      client: this.newRecord.client!,
      serviceName: this.newRecord.serviceName!,
      employee: this.newRecord.employee!,
      payment: this.newRecord.payment!,
      amount: Number(this.newRecord.amount),
      createdAt: new Date(),
      serviceId: this.newRecord.serviceId!
    };

    await this.db.agregarUsuario(record, 'records');

    console.log('atencion --->', record)
    this.records.unshift(record);

    this.newRecord = {
      client: '',
      serviceName: '',
      employee: '',
      payment: 'Efectivo',
      amount: 0,
      serviceId:''
    };

    this.showForm = false;
  }

  onServiceChange() {
    const selectedService = this.services.find(
      service => service.name === this.newRecord.serviceName
    );

    if (selectedService) {
      this.newRecord.amount = selectedService.price;
      this.newRecord.serviceId = selectedService.id;
    }
  }
}