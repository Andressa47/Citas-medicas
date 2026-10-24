import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  callOutline,
  mailOutline,
  medicalOutline,
  ribbonOutline,
  businessOutline,
  locationOutline,
  timeOutline,
  personOutline,
  calendarOutline
} from 'ionicons/icons';

import {
  Medico,
  MedicoService
} from '../services/medico.service';

@Component({
  selector: 'app-perfil-medico',
  templateUrl: './perfil-medico.page.html',
  styleUrls: ['./perfil-medico.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonButton,
    IonSpinner
  ]
})
export class PerfilMedicoPage {

  medico: Medico | undefined;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicoService: MedicoService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      callOutline,
      mailOutline,
      medicalOutline,
      ribbonOutline,
      businessOutline,
      locationOutline,
      timeOutline,
      personOutline,
      calendarOutline
    });
  }

  ionViewWillEnter() {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.cargarMedico(id);
  }

  cargarMedico(id: number) {
    this.cargando = true;

    this.medicoService.obtenerPorId(id).subscribe({
      next: (medico) => {
        this.medico = medico;
        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error al cargar médico:',
          error
        );

        this.cargando = false;

        alert(
          'No se pudo cargar el perfil del médico.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  reservarCita() {
    if (!this.medico) {
      return;
    }

    this.router.navigate(
      ['/tabs/tab2'],
      {
        queryParams: {
          especialidadId:
            this.medico.especialidad.id,

          medicoId:
            this.medico.id
        }
      }
    );
  }
}