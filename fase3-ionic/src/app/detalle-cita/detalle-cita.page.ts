import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonSpinner
} from '@ionic/angular';

import {
  CitaResponse,
  CitaService
} from '../services/cita.service';

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.page.html',
  styleUrls: ['./detalle-cita.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonBackButton,
    IonButtons,
    IonSpinner
  ]
})
export class DetalleCitaPage {

  cita: CitaResponse | null = null;

  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService,
    private cdr: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.cargarCita(id);
  }

  cargarCita(id: number) {

    this.cargando = true;

    this.citaService
      .listarMisCitas()
      .subscribe({

        next: (citas) => {

          this.cita =
            citas.find(
              cita => cita.id === id
            ) || null;

          this.cargando = false;

          this.cdr.detectChanges();
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

  verPerfilMedico() {

    if (!this.cita) {
      return;
    }

    this.router.navigate([
      '/tabs/perfil-medico',
      this.cita.medicoId
    ]);
  }

  abrirChat() {

    if (!this.cita) {
      return;
    }

    this.router.navigate([
      '/tabs/chat-cita',
      this.cita.id
    ]);
  }

  cancelarCita() {

    if (!this.cita) {
      return;
    }

    const confirmar = confirm(
      '¿Deseas cancelar esta cita?'
    );

    if (!confirmar) {
      return;
    }

    this.citaService
      .cancelarCita(this.cita.id)
      .subscribe({

        next: (respuesta) => {

          this.cita = respuesta;

          alert(
            'Cita cancelada correctamente.'
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al cancelar la cita:',
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