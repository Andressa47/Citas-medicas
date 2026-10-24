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
  IonCard,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonIcon,
  IonLabel
} from '@ionic/angular';

import { Router } from '@angular/router';

import { addIcons } from 'ionicons';

import {
  calendarOutline,
  calendarNumberOutline,
  timeOutline,
  searchOutline,
  chatbubbleEllipsesOutline,
  alertCircleOutline,
  chevronForwardOutline,
  personCircleOutline
} from 'ionicons/icons';

import {
  CitaResponse,
  CitaService
} from '../services/cita.service';

import {
  ChatService
} from '../services/chat.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonList,
    IonItem,
    IonIcon,
    IonLabel
  ],
})
export class Tab1Page {

  citas: CitaResponse[] = [];

  mensajesNoLeidos: {
    [citaId: number]: number
  } = {};

  nombrePaciente = 'Paciente';

  constructor(
    private router: Router,
    private citaService: CitaService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      calendarOutline,
      calendarNumberOutline,
      timeOutline,
      searchOutline,
      chatbubbleEllipsesOutline,
      alertCircleOutline,
      chevronForwardOutline,
      personCircleOutline
    });
  }

  ionViewWillEnter() {
    this.cargarInicio();
  }

  cargarInicio() {
    this.citaService
      .listarMisCitas()
      .subscribe({
        next: (citas) => {
          this.citas = citas;

          if (citas.length > 0) {
            this.nombrePaciente =
              citas[0].pacienteNombre || 'Paciente';
          }

          this.cargarMensajesNoLeidos();

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(
            'Error al cargar inicio:',
            error
          );
        }
      });
  }

  cargarMensajesNoLeidos() {
    this.mensajesNoLeidos = {};

    for (const cita of this.citas) {

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
              'Error al contar mensajes:',
              error
            );

            this.mensajesNoLeidos[cita.id] = 0;
          }
        });
    }
  }

  get citasPendientes(): CitaResponse[] {
    return this.citas.filter(
      cita =>
        cita.estado === 'PENDIENTE'
    );
  }

  get citasConMensajesNoLeidos(): CitaResponse[] {
    return this.citas.filter(
      cita =>
        cita.estado !== 'CANCELADA' &&
        (this.mensajesNoLeidos[cita.id] || 0) > 0
    );
  }

  obtenerMensajesNoLeidos(
    citaId: number
  ): number {
    return this.mensajesNoLeidos[citaId] || 0;
  }

  buscarHorarios() {
    this.router.navigate([
      '/tabs/tab2'
    ]);
  }

  verProximasCitas() {
    this.router.navigate([
      '/tabs/tab3'
    ]);
  }

  verHistorial() {
    this.router.navigate([
      '/tabs/tab3'
    ]);
  }

  verPerfil() {
    this.router.navigate([
      '/tabs/perfil-paciente'
    ]);
  }

  verDetalle(
    citaId: number
  ) {
    this.router.navigate([
      '/tabs/detalle-cita',
      citaId
    ]);
  }

  abrirChat(
    citaId: number
  ) {
    this.router.navigate([
      '/tabs/chat-cita',
      citaId
    ]);
  }
}