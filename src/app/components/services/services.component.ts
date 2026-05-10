import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
showForm = false;

  services: Service[] = [
    {
      id: '1',
      name: 'Corte clásico',
      price: 8000,
      duration: 40,
      active: true
    },
    {
      id: '2',
      name: 'Corte + Barba',
      price: 12000,
      duration: 60,
      active: true
    }
  ];

  newService: Partial<Service> = {
    name: '',
    price: 0,
    duration: 0,
    active: true
  };

  toggleForm() {
    this.showForm = !this.showForm;
  }
addService() {

    if (!this.newService.name || !this.newService.price) return;

    const service: Service = {
      id: Date.now().toString(),
      name: this.newService.name,
      price: Number(this.newService.price),
      duration: Number(this.newService.duration),
      active: true
    };

    this.services.unshift(service);

    this.newService = {
      name: '',
      price: 0,
      duration: 0,
      active: true
    };

    this.showForm = false;
  }

  deleteService(id: string) {
    this.services = this.services.filter(s => s.id !== id);
  }
}
