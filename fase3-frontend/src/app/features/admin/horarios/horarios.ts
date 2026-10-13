import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {
  HorariosService
} from '../../../core/services/horarios';

import {
  MedicosService
} from '../../../core/services/medicos';


@Component({
  selector: 'app-horarios',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './horarios.html',

  styleUrl: './horarios.css'
})
export class Horarios implements OnInit {

  medicos: any[] = [];

  horarios: any[] = [];

  mostrarFormulario = false;

  cargando = false;

  mensaje = '';

  error = '';

  filtroForm: FormGroup;

  horarioForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private horariosService: HorariosService,
    private medicosService: MedicosService,
    private cdr: ChangeDetectorRef
  ) {

    // ==========================================
    // FORMULARIO DE FILTRO
    // ==========================================

    this.filtroForm =
      this.fb.group({

        medicoId: [
          null,
          Validators.required
        ],

        fecha: [
          ''
        ]

      });


    // ==========================================
    // FORMULARIO DE NUEVO HORARIO
    // ==========================================

    this.horarioForm =
      this.fb.group(
        {

          fechaHoraInicio: [
            '',
            Validators.required
          ],

          fechaHoraFin: [
            '',
            Validators.required
          ]

        },

        {
          validators:
            this.validarRangoHorario()
        }

      );

  }


  ngOnInit(): void {

    this.cargarMedicos();

  }


  // ==========================================
  // MÉDICO ACTUAL DEL FILTRO
  // ==========================================

  get medicoSeleccionadoId(): number | null {

    return (
      this.filtroForm
        .get('medicoId')
        ?.value ?? null
    );

  }


  // ==========================================
  // VALIDAR HORARIO
  // ==========================================

  validarRangoHorario(): ValidatorFn {

    return (
      control: AbstractControl
    ): ValidationErrors | null => {

      const inicio =
        control
          .get('fechaHoraInicio')
          ?.value;

      const fin =
        control
          .get('fechaHoraFin')
          ?.value;


      // Si todavía falta algún campo,
      // Validators.required se encargará.
      if (!inicio || !fin) {

        return null;

      }


      const fechaInicio =
        new Date(inicio);

      const fechaFin =
        new Date(fin);


      if (
        fechaFin.getTime()
        <=
        fechaInicio.getTime()
      ) {

        return {
          rangoInvalido: true
        };

      }


      return null;

    };

  }


  // ==========================================
  // CARGAR MÉDICOS
  // ==========================================

  cargarMedicos(): void {

    this.medicosService
      .listarTodos()
      .subscribe({

        next: (data) => {

          this.medicos = data;

          console.log(
            'Médicos cargados:',
            data
          );

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar médicos:',
            err
          );

          this.error =
            'No se pudieron cargar los médicos.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // BUSCAR HORARIOS
  // ==========================================

  buscarHorarios(): void {

    this.mensaje = '';

    this.error = '';


    const medicoId =
      this.filtroForm
        .get('medicoId')
        ?.value;


    const fecha =
      this.filtroForm
        .get('fecha')
        ?.value;


    if (!medicoId) {

      this.filtroForm
        .get('medicoId')
        ?.markAsTouched();

      this.error =
        'Debes seleccionar un médico.';

      return;

    }


    this.cargando = true;


    this.horariosService
      .listarDisponibles(
        medicoId,
        fecha || undefined
      )
      .subscribe({

        next: (data) => {

          this.horarios = data;

          this.cargando = false;

          console.log(
            'Horarios cargados:',
            data
          );

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar horarios:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudieron cargar los horarios.';

          this.cargando = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ABRIR FORMULARIO
  // ==========================================

  abrirFormulario(): void {

    this.mensaje = '';

    this.error = '';


    if (!this.medicoSeleccionadoId) {

      this.filtroForm
        .get('medicoId')
        ?.markAsTouched();

      this.error =
        'Primero debes seleccionar un médico.';

      return;

    }


    this.horarioForm.reset({

      fechaHoraInicio: '',

      fechaHoraFin: ''

    });


    this.mostrarFormulario = true;

  }


  // ==========================================
  // CREAR HORARIO
  // ==========================================

  guardarHorario(): void {

    this.mensaje = '';

    this.error = '';


    if (!this.medicoSeleccionadoId) {

      this.error =
        'Debes seleccionar un médico.';

      return;

    }


    if (this.horarioForm.invalid) {

      this.horarioForm
        .markAllAsTouched();


      if (
        this.horarioForm
          .hasError('rangoInvalido')
      ) {

        this.error =
          'La fecha y hora de fin debe ser posterior a la fecha y hora de inicio.';

      } else {

        this.error =
          'Debes completar correctamente todos los campos del horario.';

      }

      return;

    }


    const valores =
      this.horarioForm
        .getRawValue();


    const horario = {

      medicoId:
        this.medicoSeleccionadoId,

      fechaHoraInicio:
        valores.fechaHoraInicio,

      fechaHoraFin:
        valores.fechaHoraFin,

      disponible: true

    };


    this.horariosService
      .crear(horario)
      .subscribe({

        next: () => {

          this.mensaje =
            'Horario creado correctamente.';

          this.mostrarFormulario =
            false;

          this.horarioForm.reset();

          this.buscarHorarios();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al crear horario:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo crear el horario.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ELIMINAR HORARIO
  // ==========================================

  eliminarHorario(
    horario: any
  ): void {

    if (!horario.id) {

      return;

    }


    const confirmar =
      confirm(
        '¿Deseas eliminar este horario?'
      );


    if (!confirmar) {

      return;

    }


    this.horariosService
      .eliminar(horario.id)
      .subscribe({

        next: () => {

          this.mensaje =
            'Horario eliminado correctamente.';

          this.buscarHorarios();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al eliminar horario:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo eliminar el horario.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CANCELAR FORMULARIO
  // ==========================================

  cancelarFormulario(): void {

    this.mostrarFormulario =
      false;

    this.horarioForm.reset();

    this.error = '';

  }

}