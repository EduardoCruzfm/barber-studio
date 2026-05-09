import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

   form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  fechaActual = new Date();
  mesActual = this.fechaActual.getMonth(); 
  email = '';
  password = '';
  userList: any[] = [];
  
  currentuser: any;

  constructor(private router: Router, private authService: AuthService, 
              private db: DatabaseService, private user: UserService) {
      this.getUsers();
  }

   getUsers(){
    this.db.traerUsuario('users').subscribe((response) => {
      this.userList = response;
      console.log('Lista de usuarios:', this.userList);
    });
  }

  async login() {
    
    if (this.form.valid) {
      const { email, password } = this.form.value;

       if (typeof email === 'string' && typeof password === 'string') {

        try {
          await this.authService.login(email, password);
          
          const esAdmin = this.userList.some((user: any) => 
            user.email == email && user.perfil == 'Admin'
          );
        
          this.user.setUsuarioPerfil(esAdmin ? 'Admin' : 'Empleado');

          // Esperar usuario
          await this.obtenerUsuario('users');

          // RECIÉN navegar
          this.router.navigate(['/dashboard']);

        } catch (error) {
          console.error('Error al iniciar sesión:', error);
        }
         
      }

     this.setterForms();
    }
  }

   async obtenerUsuario(perfil: string){
    const User =  this.authService.getCurrentUser();
    if (User) {
      this.currentuser =  await this.db.obtenerUsuarioPorId(User.uid, perfil);
      if (this.currentuser) {
        this.user.setUsuario(this.currentuser);
        console.log("Usuario actual: ", this.currentuser);
      }
    }
    else{
      console.log("ERROR -> ", User);
    } 
  }

  setterForms(){
    this.form.get('email')?.setValue('');
    this.form.get('password')?.setValue('');
  }
}