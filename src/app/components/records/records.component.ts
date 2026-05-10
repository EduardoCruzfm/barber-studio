import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';

interface RecordItem {
  id: string;
  client: string;
  service: string;
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

  records: RecordItem[] = [
    {
      id: '1',
      client: 'Juan Pérez',
      service: 'Corte clásico',
      employee: 'Marcos',
      payment: 'Efectivo',
      amount: 8000,
      createdAt: new Date()
    }
  ];

  newRecord: Partial<RecordItem> = {
    client: '',
    service: '',
    employee: '',
    payment: 'Efectivo',
    amount: 0
  };

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addRecord() {

    if (!this.newRecord.client || !this.newRecord.service) return;

    const record: RecordItem = {
      id: Date.now().toString(),
      client: this.newRecord.client!,
      service: this.newRecord.service!,
      employee: this.newRecord.employee!,
      payment: this.newRecord.payment!,
      amount: Number(this.newRecord.amount),
      createdAt: new Date()
    };

    this.records.unshift(record);

    this.newRecord = {
      client: '',
      service: '',
      employee: '',
      payment: 'Efectivo',
      amount: 0
    };

    this.showForm = false;
  }
}