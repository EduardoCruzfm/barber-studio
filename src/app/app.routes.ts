import { Routes } from '@angular/router';

export const routes: Routes = [

  // 🔐 LOGIN (fuera del layout)
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(
        (m) => m.RegisterComponent
      )
  },

  // 🔓 APP (con sidebar)
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./components/employees/employees.component').then(
            (m) => m.EmployeesComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // fallback
  {
    path: '**',
    redirectTo: 'login'
  }
];