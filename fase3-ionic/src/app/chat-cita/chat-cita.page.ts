import {
  Component,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonTextarea,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  sendOutline,
  chatbubbleEllipsesOutline
} from 'ionicons/icons';

import {
  ChatService,
  Mensaje
} from '../services/chat.service';

import {
  CitaService
} from '../services/cita.service';

@Component({
  selector: 'app-chat-cita',
  templateUrl: './chat-cita.page.html',
  styleUrls: ['./chat-cita.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonButton,
    IonTextarea,
    IonSpinner
  ]
})
export class ChatCitaPage implements OnDestroy {

  citaId!: number;
  pacienteId!: number;

  mensajes: Mensaje[] = [];

  nuevoMensaje = '';

  cargando = true;
  enviando = false;

  private intervaloActualizacion: any = null;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private citaService: CitaService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      sendOutline,
      chatbubbleEllipsesOutline
    });
  }

  ionViewWillEnter() {

    this.citaId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.detenerActualizacionAutomatica();

    this.cargarInformacionCita();
  }

  ionViewWillLeave() {
    this.detenerActualizacionAutomatica();
  }

  ngOnDestroy() {
    this.detenerActualizacionAutomatica();
  }

  cargarInformacionCita() {

    this.cargando = true;

    this.citaService
      .listarMisCitas()
      .subscribe({

        next: (citas) => {

          const citaActual =
            citas.find(
              cita => cita.id === this.citaId
            );

          if (!citaActual) {

            this.cargando = false;

            alert(
              'No se encontró la información de la cita.'
            );

            this.cdr.detectChanges();

            return;
          }

          this.pacienteId =
            citaActual.pacienteId;

          this.cargarMensajesIniciales();
        },

        error: (error) => {

          console.error(
            'Error al cargar la cita:',
            error
          );

          this.cargando = false;

          alert(
            'No se pudo cargar la información de la cita.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  cargarMensajesIniciales() {

    this.chatService
      .listarMensajes(this.citaId)
      .subscribe({

        next: (mensajes) => {

          this.mensajes = mensajes;

          this.cargando = false;

          this.cdr.detectChanges();

          this.iniciarActualizacionAutomatica();
        },

        error: (error) => {

          console.error(
            'Error al cargar mensajes:',
            error
          );

          this.cargando = false;

          alert(
            'No se pudieron cargar los mensajes.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  iniciarActualizacionAutomatica() {

    this.detenerActualizacionAutomatica();

    this.intervaloActualizacion =
      setInterval(() => {

        this.actualizarMensajesSilenciosamente();

      }, 3000);
  }

  actualizarMensajesSilenciosamente() {

    if (!this.citaId) {
      return;
    }

    this.chatService
      .listarMensajes(this.citaId)
      .subscribe({

        next: (mensajes) => {

          const huboCambio =
            mensajes.length !==
            this.mensajes.length;

          this.mensajes = mensajes;

          if (huboCambio) {
            this.cdr.detectChanges();
          }
        },

        error: (error) => {

          console.error(
            'Error al actualizar mensajes:',
            error
          );
        }
      });
  }

  detenerActualizacionAutomatica() {

    if (
      this.intervaloActualizacion !== null
    ) {

      clearInterval(
        this.intervaloActualizacion
      );

      this.intervaloActualizacion = null;
    }
  }

  enviarMensaje() {

    const contenido =
      this.nuevoMensaje.trim();

    if (
      !contenido ||
      this.enviando
    ) {
      return;
    }

    this.enviando = true;

    this.chatService
      .enviarMensaje(
        this.citaId,
        contenido
      )
      .subscribe({

        next: (mensaje) => {

          this.mensajes.push(
            mensaje
          );

          this.nuevoMensaje = '';

          this.enviando = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al enviar mensaje:',
            error
          );

          this.enviando = false;

          alert(
            error.error?.message ||
            'No se pudo enviar el mensaje.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  esMensajePropio(
    mensaje: Mensaje
  ): boolean {

    return (
      mensaje.remitenteId ===
      this.pacienteId
    );
  }
}