import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserModel } from '../../models';
import { ServiceRecordService } from '../../services/service-record.service';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarOpen = false;
  // currentEmployee: UserModel;
  usuarioActual: any;

  constructor(private serviceRecord: ServiceRecordService, private authService: AuthService,
              private db: DatabaseService, private user: UserService) {
    // this.usuarioActual = this.serviceRecord.getCurrentEmployee();
    // this.currentEmployee = this.serviceRecord.getCurrentEmployee();
  }

  ngOnInit(): void {
    // Carga inicial del usuario actual
    this.user.initUsuario(); 

    this.user.usuario$.subscribe(user => {
      this.usuarioActual = user;
      console.log("usuarioActual", user);
    });

  }


  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
