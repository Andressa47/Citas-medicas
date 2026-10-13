import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MedicosService } from '../../../core/services/medicos';
import { UsuariosService } from '../../../core/services/usuarios';

import {
  EspecialidadesService,
  Especialidad
} from '../../../core/services/especialidades';


@Component({
  selector: 'app-medicos',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './medicos.html',

  styleUrl: './medicos.css'
})
export class Medicos implements OnInit {

  medicos: any[] = [];

  usuariosMedicos: any[] = [];

  especialidades: Especialidad[] = [];

  cargando = false;

  mostrarFormulario = false;

  modoEdicion = false;

  mensaje = '';

  error = '';

  medicoIdEdicion: number | null = null;

  medicoForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private medicosService: MedicosService,
    private usuariosService: UsuariosService,
    private especialidadesService: EspecialidadesService,
    private cdr: ChangeDetectorRef
  ) {

    this.medicoForm =
      this.fb.group({

        usuarioId: [
          null,
          Validators.required
        ],

        especialidadId: [
          null,
          Validators.required
        ],

        numeroColegiado: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ]

      });

  }


  ngOnInit(): void {

    this.cargarTodo();

  }


  // ==========================================
  // CARGAR TODO
  // ==========================================

  cargarTodo(): void {

    this.cargarMedicos();

    this.cargarUsuariosMedicos();

    this.cargarEspecialidades();

  }


  // ==========================================
  // CARGAR MÉDICOS
  // ==========================================

  cargarMedicos(): void {

    this.cargando = true;

    this.medicosService
      .listarTodos()
      .subscribe({

        next: (data) => {

          this.medicos = data;

          this.cargando = false;

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
            err?.error?.message ||
            'No se pudieron cargar los médicos.';

          this.cargando = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // USUARIOS ROLE_DOCTOR
  // ==========================================

  cargarUsuariosMedicos(): void {

    this.usuariosService
      .listarTodos()
      .subscribe({

        next: (data) => {

          this.usuariosMedicos =
            data.filter(
              usuario =>
                usuario.rol === 'ROLE_DOCTOR'
            );

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar usuarios médicos:',
            err
          );

        }

      });

  }


  // ==========================================
  // ESPECIALIDADES
  // ==========================================

  cargarEspecialidades(): void {

    this.especialidadesService
      .listarTodas()
      .subscribe({

        next: (data) => {

          this.especialidades = data;

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar especialidades:',
            err
          );

        }

      });

  }


  // ==========================================
  // NUEVO MÉDICO
  // ==========================================

  nuevoMedico(): void {

    this.modoEdicion = false;

    this.medicoIdEdicion = null;

    this.medicoForm.reset({

      usuarioId: null,

      especialidadId: null,

      numeroColegiado: ''

    });

    this.mostrarFormulario = true;

    this.mensaje = '';

    this.error = '';

  }


  // ==========================================
  // EDITAR MÉDICO
  // ==========================================

  editarMedico(medico: any): void {

    this.modoEdicion = true;

    this.medicoIdEdicion =
      medico.id;


    this.medicoForm.patchValue({

      usuarioId:
        medico.usuario?.id,

      especialidadId:
        medico.especialidad?.id,

      numeroColegiado:
        medico.numeroColegiado

    });


    this.mostrarFormulario = true;

    this.mensaje = '';

    this.error = '';

  }


  // ==========================================
  // GUARDAR
  // ==========================================

  guardarMedico(): void {

    this.mensaje = '';

    this.error = '';


    if (this.medicoForm.invalid) {

      this.medicoForm
        .markAllAsTouched();

      this.error =
        'Debes completar correctamente todos los campos.';

      return;

    }


    const valores =
      this.medicoForm.getRawValue();


    const medico = {

      usuario: {

        id: valores.usuarioId

      },

      especialidad: {

        id: valores.especialidadId

      },

      numeroColegiado:
        valores.numeroColegiado.trim()

    };


    if (this.modoEdicion) {

      this.actualizarMedico(
        medico
      );

    } else {

      this.crearMedico(
        medico
      );

    }

  }


  // ==========================================
  // CREAR
  // ==========================================

  crearMedico(medico: any): void {

    this.medicosService
      .crear(medico)
      .subscribe({

        next: () => {

          this.mensaje =
            'Médico creado correctamente.';

          this.mostrarFormulario =
            false;

          this.medicoForm.reset();

          this.cargarMedicos();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al crear médico:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo crear el médico.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ACTUALIZAR
  // ==========================================

  actualizarMedico(medico: any): void {

    if (!this.medicoIdEdicion) {

      this.error =
        'No se encontró el médico a actualizar.';

      return;

    }


    this.medicosService
      .actualizar(
        this.medicoIdEdicion,
        medico
      )
      .subscribe({

        next: () => {

          this.mensaje =
            'Médico actualizado correctamente.';

          this.mostrarFormulario =
            false;

          this.medicoForm.reset();

          this.cargarMedicos();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al actualizar médico:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo actualizar el médico.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ELIMINAR
  // ==========================================

  eliminarMedico(medico: any): void {

    if (!medico.id) {
      return;
    }


    const confirmar =
      confirm(
        `¿Deseas eliminar al médico "${medico.usuario?.nombreCompleto}"?`
      );


    if (!confirmar) {
      return;
    }


    this.medicosService
      .eliminar(medico.id)
      .subscribe({

        next: () => {

          this.mensaje =
            'Médico eliminado correctamente.';

          this.cargarMedicos();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al eliminar médico:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo eliminar el médico.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CANCELAR
  // ==========================================

  cancelarFormulario(): void {

    this.mostrarFormulario =
      false;

    this.medicoForm.reset();

    this.error = '';

  }

}