import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular';

import { Router } from '@angular/router';

import {
  CitaResponse,
  CitaService
} from '../services/cita.service';

import {
  ChatService
} from '../services/chat.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
  ],
})
export class Tab3Page {

  citas: CitaResponse[] = [];

  mensajesNoLeidos: {
    [citaId: number]: number
  } = {};

  constructor(
    private citaService: CitaService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.cargarCitas();
  }

  cargarCitas() {

    this.citaService
      .listarMisCitas()
      .subscribe({

        next: (respuesta) => {

          this.citas = respuesta;

          console.log(
            'Mis citas:',
            respuesta
          );

          this.cargarMensajesNoLeidos();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al cargar citas:',
            error
          );

          alert(
            'No se pudieron cargar tus citas. Código: ' +
            error.status
          );
        }
      });
  }

  cargarMensajesNoLeidos() {

    this.mensajesNoLeidos = {};

    for (const cita of this.citas) {

      // No necesitamos mostrar mensajes nuevos
      // en citas canceladas.
      if (cita.estado === 'CANCELADA') {
        continue;
      }

      this.chatService
        .contarMensajesNoLeidos(cita.id)
        .subscribe({

          next: (cantidad) => {

            this.mensajesNoLeidos[cita.id] =
              cantidad;

            this.cdr.detectChanges();
          },

          error: (error) => {

            console.error(
              'Error al contar mensajes de la cita ' +
              cita.id,
              error
            );

            this.mensajesNoLeidos[cita.id] = 0;

            this.cdr.detectChanges();
          }
        });
    }
  }

  obtenerMensajesNoLeidos(
    citaId: number
  ): number {

    return this.mensajesNoLeidos[citaId] || 0;
  }

  tieneMensajesNoLeidos(
    citaId: number
  ): boolean {

    return (
      this.obtenerMensajesNoLeidos(citaId) > 0
    );
  }

  get citasPendientes(): CitaResponse[] {

    return this.citas.filter(
      cita =>
        cita.estado === 'PENDIENTE'
    );
  }

  get historial(): CitaResponse[] {

    return this.citas.filter(
      cita =>
        cita.estado === 'COMPLETADA' ||
        cita.estado === 'CANCELADA'
    );
  }

  verDetalle(citaId: number) {

    this.router.navigate([
      '/tabs/detalle-cita',
      citaId
    ]);
  }

  cancelarCita(citaId: number) {

    const confirmar =
      confirm(
        '¿Deseas cancelar esta cita?'
      );

    if (!confirmar) {
      return;
    }

    this.citaService
      .cancelarCita(citaId)
      .subscribe({

        next: () => {

          alert(
            'Cita cancelada correctamente.'
          );

          this.cargarCitas();
        },

        error: (error) => {

          console.error(
            'Error al cancelar cita:',
            error
          );

          alert(
            error.error?.message ||
            'No se pudo cancelar la cita.'
          );
        }
      });
  }
}