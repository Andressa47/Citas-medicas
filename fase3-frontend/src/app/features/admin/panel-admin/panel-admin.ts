import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  EspecialidadesService,
  Especialidad
} from '../../../core/services/especialidades';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdmin implements OnInit {

  especialidades: Especialidad[] = [];

  mostrarFormulario = false;

  modoEdicion = false;

  especialidadSeleccionada: Especialidad = {
    nombre: '',
    descripcion: ''
  };

  mensaje = '';

  error = '';

  cargando = false;


  constructor(
    private especialidadesService: EspecialidadesService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarEspecialidades();

  }


  // ==========================================
  // LISTAR ESPECIALIDADES
  // ==========================================

  cargarEspecialidades(): void {

    this.cargando = true;
    this.error = '';

    this.especialidadesService
      .listarTodas()
      .subscribe({

        next: (data) => {

          this.especialidades = data;

          this.cargando = false;

          console.log(
            'Especialidades cargadas:',
            data
          );

          // Angular 22:
          // avisamos que debe actualizar la pantalla
          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar especialidades:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudieron cargar las especialidades.';

          this.cargando = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // NUEVA ESPECIALIDAD
  // ==========================================

  nuevaEspecialidad(): void {

    this.modoEdicion = false;

    this.especialidadSeleccionada = {
      nombre: '',
      descripcion: ''
    };

    this.mostrarFormulario = true;

    this.mensaje = '';

    this.error = '';

  }


  // ==========================================
  // EDITAR
  // ==========================================

  editarEspecialidad(
    especialidad: Especialidad
  ): void {

    this.modoEdicion = true;

    this.especialidadSeleccionada = {
      id: especialidad.id,
      nombre: especialidad.nombre,
      descripcion: especialidad.descripcion
    };

    this.mostrarFormulario = true;

    this.mensaje = '';

    this.error = '';

  }


  // ==========================================
  // DECIDIR SI CREAR O ACTUALIZAR
  // ==========================================

  guardarEspecialidad(): void {

    this.mensaje = '';
    this.error = '';

    if (
      !this.especialidadSeleccionada.nombre.trim()
    ) {

      this.error =
        'El nombre de la especialidad es obligatorio.';

      return;

    }


    if (this.modoEdicion) {

      this.actualizarEspecialidad();

    } else {

      this.crearEspecialidad();

    }

  }


  // ==========================================
  // CREAR
  // ==========================================

  crearEspecialidad(): void {

    this.especialidadesService
      .crear(this.especialidadSeleccionada)
      .subscribe({

        next: (especialidadCreada) => {

          console.log(
            'Especialidad creada:',
            especialidadCreada
          );

          this.mensaje =
            'Especialidad creada correctamente.';

          this.mostrarFormulario = false;

          this.cargarEspecialidades();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al crear especialidad:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo crear la especialidad.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ACTUALIZAR
  // ==========================================

  actualizarEspecialidad(): void {

    if (!this.especialidadSeleccionada.id) {
      return;
    }

    this.especialidadesService
      .actualizar(
        this.especialidadSeleccionada.id,
        this.especialidadSeleccionada
      )
      .subscribe({

        next: (especialidadActualizada) => {

          console.log(
            'Especialidad actualizada:',
            especialidadActualizada
          );

          this.mensaje =
            'Especialidad actualizada correctamente.';

          this.mostrarFormulario = false;

          this.cargarEspecialidades();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al actualizar especialidad:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo actualizar la especialidad.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ELIMINAR
  // ==========================================

  eliminarEspecialidad(
    especialidad: Especialidad
  ): void {

    if (!especialidad.id) {
      return;
    }

    const confirmar = confirm(
      `¿Deseas eliminar la especialidad "${especialidad.nombre}"?`
    );

    if (!confirmar) {
      return;
    }


    this.especialidadesService
      .eliminar(especialidad.id)
      .subscribe({

        next: () => {

          console.log(
            'Especialidad eliminada:',
            especialidad
          );

          this.mensaje =
            'Especialidad eliminada correctamente.';

          this.cargarEspecialidades();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al eliminar especialidad:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo eliminar la especialidad.';

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CANCELAR FORMULARIO
  // ==========================================

  cancelarFormulario(): void {

    this.mostrarFormulario = false;

    this.mensaje = '';

    this.error = '';

  }

}