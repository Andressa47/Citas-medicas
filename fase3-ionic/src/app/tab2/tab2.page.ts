import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonTextarea
} from '@ionic/angular';

import {
  Especialidad,
  EspecialidadService
} from '../services/especialidad.service';

import {
  Medico,
  MedicoService
} from '../services/medico.service';

import {
  HorarioDisponible,
  HorarioService
} from '../services/horario.service';

import {
  CitaService
} from '../services/cita.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonTextarea
  ],
})
export class Tab2Page implements OnInit {

  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  horarios: HorarioDisponible[] = [];

  especialidadSeleccionada: number | null = null;
  medicoSeleccionado: number | null = null;
  horarioSeleccionado: HorarioDisponible | null = null;

  motivo = '';

  constructor(
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private horarioService: HorarioService,
    private citaService: CitaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {

    this.especialidadService
      .listarEspecialidades()
      .subscribe({

        next: (respuesta) => {

          this.especialidades = respuesta;

          console.log(
            'Especialidades:',
            respuesta
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al cargar especialidades:',
            error
          );

        }

      });

  }

  cargarMedicos(especialidadId: number) {

    this.medicos = [];
    this.horarios = [];

    this.medicoSeleccionado = null;
    this.horarioSeleccionado = null;
    this.motivo = '';

    console.log(
      'Especialidad seleccionada:',
      especialidadId
    );

    this.medicoService
      .listarPorEspecialidad(especialidadId)
      .subscribe({

        next: (respuesta) => {

          this.medicos = respuesta;

          console.log(
            'Médicos encontrados:',
            respuesta
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al cargar médicos:',
            error
          );

          alert(
            'No se pudieron cargar los médicos. Código: ' +
            error.status
          );

        }

      });

  }

  cargarHorarios() {

    this.horarios = [];
    this.horarioSeleccionado = null;
    this.motivo = '';

    if (this.medicoSeleccionado === null) {
      return;
    }

    console.log(
      'Buscando horarios del médico:',
      this.medicoSeleccionado
    );

    this.horarioService
      .listarDisponiblesPorMedico(
        this.medicoSeleccionado
      )
      .subscribe({

        next: (respuesta) => {

          this.horarios = respuesta;

          console.log(
            'Horarios disponibles:',
            respuesta
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al cargar horarios:',
            error
          );

        }

      });

  }

  seleccionarHorario(
    horario: HorarioDisponible
  ) {

    this.horarioSeleccionado = horario;

    console.log(
      'Horario seleccionado:',
      horario
    );

    this.cdr.detectChanges();
  }

  confirmarReserva() {

    if (
      this.horarioSeleccionado === null ||
      !this.motivo.trim()
    ) {
      return;
    }

    const horarioId =
      this.horarioSeleccionado.id;

    const motivo =
      this.motivo.trim();

    console.log(
      'Reservando horario:',
      horarioId
    );

    this.citaService
      .crearCita(
        horarioId,
        motivo
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Cita creada:',
            respuesta
          );

          alert(
            '¡Cita reservada correctamente!'
          );

          this.horarioSeleccionado = null;
          this.motivo = '';

          this.cargarHorarios();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al reservar la cita:',
            error
          );

          alert(
            'Error HTTP: ' +
            error.status +
            '\n\n' +
            'Mensaje: ' +
            (
              error.error?.message ||
              error.message ||
              'Sin mensaje'
            )
          );

        }

      });

  }

}