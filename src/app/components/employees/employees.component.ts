import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { UserModel, UserRole } from '../../models';
import { UserEntity } from '../../models/user.entity';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ReactiveFormsModule,ModalComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  showForm = false;
  employees : any[] = [];
  message?: string; 
  title?: string;
  modalAction: 'delete' | 'update' | null = null;
  showDeleteModal = false;
  selectedEmployee!: UserModel;
  editing = false;
  newEmployee: Partial<UserModel>= {
    name: '',
    role: 'employee'
  };

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    // password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private db:DatabaseService) {
    this.getUsers();
  }

  getUsers(){
    this.db.traerUsuario('users').subscribe((response) => {
      this.employees = response;
      console.log('Lista de empleados:', this.employees);
    });
  }

  toggleForm() {
    this.form.reset();
    this.showForm = !this.showForm;
  }

  async addEmployee(e: Event) {
    e.preventDefault();

    if (this.form.valid) {
      const { name,lastName,email,role } = this.form.value;
      if (typeof name === 'string' && typeof lastName === 'string' &&  typeof email === 'string' && 
                typeof role === 'string') {
                
        try {
          // const userCredential = await this.authService.register(email, password);
          // const userId = userCredential.user?.uid;
          const role = this.form.value.role as UserRole;

          const userData: UserModel = {
            id: '' ,
            name: name ,
            lastName: lastName,
            email: email,
            role: role,
            approved: false,
            createdAt: new Date(),
            active: false
          };

          const user = new UserEntity(userData);
          console.log('Usuario registrado:', user.data);
          await this.db.agregarDocumento(user.data, 'users');

          this.form.reset();
          this.showForm = false;
          
        } catch (error) {
          console.error('Error al registrar usuario:', error);
        }
      }

    }
  }

  deleteEmployees(employee: UserModel){
    this.selectedEmployee = employee;

    this.modalAction = 'delete';

    this.title = 'Eliminar empleado';
    this.message = '¿Estás seguro de eliminar este empleado? Esta acción no se puede deshacer.';
  
    this.showDeleteModal = true;
  }

  uptadeEmployees(employee: UserModel){
    this.editing = true;
    this.showForm = true;

    this.selectedEmployee = employee;

    this.form.patchValue({
      name: employee.name,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role
    });
  }

  openUpdateModal() {
    this.modalAction = 'update';

    this.title = 'Modificar empleado';
    this.message = '¿Deseas guardar los cambios realizados?';

    this.showDeleteModal = true;
  }

  confirmAction() {

    if (this.modalAction === 'update') {
      const employee: UserModel = {
        ...this.selectedEmployee,
        name: this.form.value.name!,
        lastName: this.form.value.lastName!,
        email: this.form.value.email!,
        role: this.form.value.role as UserRole
      };

      this.db.modificarDocumento(employee,'users');

      this.newEmployee = {
        name: '',
        email: null as any,
        role: null as any
      };

      this.showForm = false;

    } else if (this.modalAction === 'delete') {

      this.db.eliminarDocumento(this.selectedEmployee,'users');
    }

    this.showDeleteModal = false;
    this.modalAction = null;
  }

  cancelAction() {
    this.showDeleteModal = false;
  }

}