import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';


export const routes: Routes = [

  // ==========================================
  // INICIO
  // ==========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // ==========================================
  // LOGIN
  // ==========================================

  {
    path: 'login',

    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },


  // ==========================================
  // ADMINISTRACIÓN
  // ==========================================

  {
    path: 'admin',

    canActivate: [
      authGuard,
      roleGuard(['ROLE_ADMIN'])
    ],

    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout')
        .then(m => m.AdminLayout),

    children: [

  // INICIO / DASHBOARD
  {
    path: '',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  // ESPECIALIDADES
  {
    path: 'especialidades',
    loadComponent: () =>
      import('./features/admin/panel-admin/panel-admin')
        .then(m => m.PanelAdmin)
  },

  // USUARIOS
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./features/admin/usuarios/usuarios')
        .then(m => m.Usuarios)
  },

  // MÉDICOS
  {
    path: 'medicos',
    loadComponent: () =>
      import('./features/admin/medicos/medicos')
        .then(m => m.Medicos)
  },

  // HORARIOS
  {
    path: 'horarios',
    loadComponent: () =>
      import('./features/admin/horarios/horarios')
        .then(m => m.Horarios)
  }

]
  },


// GESTIÓN DE CITAS
{
  path: 'citas',
  loadComponent: () =>
    import('./features/admin/citas-admin/citas-admin')
      .then(m => m.CitasAdmin)
},


  // ==========================================
  // PANEL MÉDICO
  // ==========================================

  {
    path: 'medico',

    canActivate: [
      authGuard,
      roleGuard(['ROLE_DOCTOR'])
    ],

    loadComponent: () =>
      import('./features/medicos/panel-medico/panel-medico')
        .then(m => m.PanelMedico)
  },


  // ==========================================
  // CONSULTA MÉDICA
  // ==========================================

  {
    path: 'medico/consultas/:id',

    canActivate: [
      authGuard,
      roleGuard(['ROLE_DOCTOR'])
    ],

    loadComponent: () =>
      import('./features/medicos/consultas/consultas')
        .then(m => m.Consultas)
  },


  // ==========================================
  // RUTA DESCONOCIDA
  // ==========================================

  {
    path: '**',
    redirectTo: 'login'
  }

];