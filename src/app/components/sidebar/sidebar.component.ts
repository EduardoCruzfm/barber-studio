import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router, private authService: AuthService,
              private user: UserService
  ) {}
  
  navItems = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Servicios',
      route: '/services',
      icon: 'scissors'
    },
    {
      label: 'Atenciones',
      route: '/records',
      icon: 'receipt'
    },
    {
      label: 'Empleados',
      route: '/employees',
      icon: 'users'
    }
  ];

  onNavClick(): void {
    this.close.emit();
  }

  logout() {
    this.authService.logout().then(() => {
      this.user.clearUsuario();
      this.router.navigate(['/login']); 
    });
  }
}
