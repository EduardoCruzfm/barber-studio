import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';
import { Service } from '../../models/service.model';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  showForm = false;
  services: Service[] = [];

  constructor(private db: DatabaseService) {
    this.getServices();
  }

  newService: Partial<Service> = {
    name: '',
    price: null as any,
    duration: null as any,
    active: true
  };

  getServices(){
    this.db.traerColeccion<Service>('services').subscribe((response) => {
      this.services = response ;
      console.log('Lista de servicios:', this.services);
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async addService() {

    if (!this.newService.name || !this.newService.price || !this.newService.duration) return;

    const service: Service = {
      id: Date.now().toString(),
      name: this.newService.name,
      price: Number(this.newService.price),
      duration: Number(this.newService.duration),
      active: true
    };

    await this.db.agregarDocumento(service,'services');
    console.log('Servicio', service) 

    // this.services.unshift(service);

    this.newService = {
      name: '',
      price: null as any,
      duration: null as any,
      active: true
    };

    this.showForm = false;
  }

  deleteService(id: string) {
    this.services = this.services.filter(s => s.id !== id);
  }
}
