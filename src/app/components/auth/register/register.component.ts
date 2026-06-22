import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel, UserRole } from '../../../models';
import { UserEntity } from '../../../models/user.entity';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

   form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService, private db:DatabaseService) {}

  async register() {

    if (this.form.valid)  {
      const { name,lastName,email,password,role } = this.form.value;

      if (typeof name === 'string' && typeof lastName === 'string' &&  typeof email === 'string' && 
          typeof password === 'string' && typeof role === 'string') {
          
            try {
              const userCredential = await this.authService.register(email, password);
              const userId = userCredential.user?.uid;

              const role = this.form.value.role as UserRole;

              const userData: UserModel = {
                id: userId,
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
              await this.db.agregarUsuario(user.data, 'users');
              
            } catch (error) {
              console
            }
          
          }

    // 🔥 después va Firebase
    }

    this.router.navigate(['/login']);
  }
}