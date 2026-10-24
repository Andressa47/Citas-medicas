import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,

    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page')
            .then((m) => m.Tab1Page),
      },

      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page')
            .then((m) => m.Tab2Page),
      },

      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page')
            .then((m) => m.Tab3Page),
      },

      {
        path: 'detalle-cita/:id',
        loadComponent: () =>
          import('../detalle-cita/detalle-cita.page')
            .then((m) => m.DetalleCitaPage),
      },

      {
        path: 'perfil-medico/:id',
        loadComponent: () =>
          import('../perfil-medico/perfil-medico.page')
            .then((m) => m.PerfilMedicoPage),
      },

      {
        path: 'chat-cita/:id',
        loadComponent: () =>
          import('../chat-cita/chat-cita.page')
            .then((m) => m.ChatCitaPage),
      },

      {
        path: 'perfil-paciente',
        loadComponent: () =>
          import('../perfil-paciente/perfil-paciente.page')
            .then((m) => m.PerfilPacientePage),
      },

      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
    ],
  },
];