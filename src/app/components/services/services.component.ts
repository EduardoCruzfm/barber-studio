import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';
import { Service } from '../../models/service.model';
import { DatabaseService } from '../../services/database.service';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ReactiveFormsModule, ModalComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  showForm = false;
  services: Service[] = [];
  selectedService!: Service;
  showDeleteModal = false;
  message?: string; 
  title?: string;
  modalAction: 'delete' | 'update' | null = null;
  editing = false;


   form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
    });

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
    this.editing = false;
    this.form.reset();
    this.showForm = !this.showForm;
  }

  async addService() {

    if (this.form.valid) {
      const { name,price,duration} = this.form.value;
      if (typeof name === 'string' && typeof price === 'number' &&  typeof duration === 'number') {

        const service: Service = {
          id: Date.now().toString(),
          name: name,
          price: price,
          duration: duration,
          active: true
        };

        await this.db.agregarDocumento(service,'services');
        console.log('Servicio', service) 

        this.form.reset();
        this.showForm = false;
      }
    }
  }

  deleteService(service: Service) {
    this.selectedService = service;

    this.modalAction = 'delete';

    this.title = 'Eliminar servicio';
    this.message = '¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.';
  
    this.showDeleteModal = true;
  }

  confirmAction() {

    if (this.modalAction === 'update') {
      const service: Service = {
        ...this.selectedService,
        name: this.form.value.name!,
        price: Number(this.form.value.price),
        duration: Number(this.form.value.duration),
        active: true
      };

      this.db.modificarDocumento(service,'services');

      this.newService = {
        name: '',
        price: null as any,
        duration: null as any,
        active: true
      };

      this.showForm = false;

    } else if (this.modalAction === 'delete') {

      this.db.eliminarDocumento(this.selectedService,'services');
    }

    this.showDeleteModal = false;
    this.modalAction = null;
    this.form.reset();
  }

  cancelAction() {
    this.showDeleteModal = false;
  }

  updateService(service: Service) {
    this.editing = true;
    this.showForm = true;

    this.selectedService = service;

    this.form.setValue({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
  }

    openUpdateModal() {
      this.modalAction = 'update';

      this.title = 'Modificar servicio';
      this.message = '¿Deseas guardar los cambios realizados?';

      this.showDeleteModal = true;
    }
}
