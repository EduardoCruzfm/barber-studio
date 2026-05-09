import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { UserModel, UserRole } from '../../models';
import { UserEntity } from '../../models/user.entity';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  showForm = false;
  employees : any[] = [];

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
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

  newEmployee = {
    name: '',
    role: 'empleado'
  };

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async addEmployee(e: Event) {
    e.preventDefault();

    if (this.form.valid) {
      const { name,lastName,email,password,role } = this.form.value;
      if (typeof name === 'string' && typeof lastName === 'string' &&  typeof email === 'string' && 
                typeof password === 'string' && typeof role === 'string') {
                
        try {
          const userCredential = await this.authService.register(email, password);
          const userId = userCredential.user?.uid;
          const role = this.form.value.role as UserRole;

          const userData: UserModel = {
            id: userId ,
            name: name + ' ' + lastName,
            email: email,
            role: role,
            approved: false,
            createdAt: new Date(),
            active: false
          };

          const user = new UserEntity(userData);
          console.log('Usuario registrado:', user.data);
          await this.db.agregarUsuario(user.data, 'users');

          this.employees.push({
            id: userId ?? '',
            name: name + ' ' + lastName,
            role: role
          });

          this.form.reset();
          this.newEmployee = { name: '', role: 'empleado' };
          this.showForm = false;
          
        } catch (error) {
          console.error('Error al registrar usuario:', error);
        }
      }

    }
  }
}