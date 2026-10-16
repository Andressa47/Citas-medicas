import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { forkJoin } from 'rxjs';

import {
  CitasService
} from '../../../core/services/citas';

import {
  UsuariosService
} from '../../../core/services/usuarios';

import {
  EspecialidadesService,
  Especialidad
} from '../../../core/services/especialidades';

import {
  MedicosService
} from '../../../core/services/medicos';

import {
  HorariosService
} from '../../../core/services/horarios';


interface Cita {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  medicoId: number;
  medicoNombre: string;
  especialidadNombre: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: string;
  motivo: string;
}


@Component({
  selector: 'app-citas-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './citas-admin.html',
  styleUrl: './citas-admin.css'
})
export class CitasAdmin implements OnInit {

  // ==========================================
  // CITAS REGISTRADAS
  // ==========================================

  citas: Cita[] = [];

  cargando = false;

  error = '';

  mensaje = '';


  // ==========================================
  // FILTROS
  // ==========================================

  filtroMedico = 0;

  filtroPaciente = '';

  filtroFecha = '';

  filtroEstado = '';


  // ==========================================
  // NUEVA CITA
  // ==========================================

  mostrarFormulario = false;

  cargandoDatosFormulario = false;

  cargandoMedicos = false;

  cargandoHorarios = false;

  guardandoCita = false;

  errorFormulario = '';

  pacientes: any[] = [];

  especialidades: Especialidad[] = [];

  medicosDisponibles: any[] = [];

  horariosDisponibles: any[] = [];


  nuevaCita = {
    pacienteId: 0,
    especialidadId: 0,
    medicoId: 0,
    fecha: '',
    horarioId: 0,
    motivo: ''
  };


  constructor(
    private citasService: CitasService,
    private usuariosService: UsuariosService,
    private especialidadesService: EspecialidadesService,
    private medicosService: MedicosService,
    private horariosService: HorariosService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarCitas();

  }


  // ==========================================
  // CARGAR CITAS
  // ==========================================

  cargarCitas(): void {

    this.cargando = true;

    this.error = '';

    this.citasService
      .listarTodas()
      .subscribe({

        next: (respuesta) => {

          this.citas =
            (respuesta as Cita[])
              .sort(
                (a, b) =>
                  b.fechaHoraInicio
                    .localeCompare(
                      a.fechaHoraInicio
                    )
              );

          this.cargando = false;

          console.log(
            'Citas cargadas:',
            this.citas
          );

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al consultar citas:',
            err
          );

          this.error =
            'No se pudieron cargar las citas. Comprueba la conexión y los permisos del administrador.';

          this.cargando = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ABRIR FORMULARIO DE NUEVA CITA
  // ==========================================

  abrirFormulario(): void {

    this.mensaje = '';

    this.errorFormulario = '';

    this.medicosDisponibles = [];

    this.horariosDisponibles = [];

    this.nuevaCita = {
      pacienteId: 0,
      especialidadId: 0,
      medicoId: 0,
      fecha: '',
      horarioId: 0,
      motivo: ''
    };

    this.mostrarFormulario = true;

    this.cargarDatosFormulario();

  }


  // ==========================================
  // CARGAR PACIENTES Y ESPECIALIDADES
  // ==========================================

  cargarDatosFormulario(): void {

    this.cargandoDatosFormulario = true;

    this.errorFormulario = '';

    forkJoin({

      usuarios:
        this.usuariosService
          .listarTodos(),

      especialidades:
        this.especialidadesService
          .listarTodas()

    })
      .subscribe({

        next: (respuesta) => {

          this.pacientes =
            respuesta.usuarios
              .filter(
                usuario =>
                  usuario.rol ===
                  'ROLE_PATIENT'
              )
              .sort(
                (a, b) =>
                  a.nombreCompleto
                    .localeCompare(
                      b.nombreCompleto
                    )
              );


          this.especialidades =
            respuesta.especialidades
              .sort(
                (a, b) =>
                  a.nombre
                    .localeCompare(
                      b.nombre
                    )
              );


          this.cargandoDatosFormulario =
            false;


          console.log(
            'Pacientes:',
            this.pacientes
          );

          console.log(
            'Especialidades:',
            this.especialidades
          );


          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar datos para la cita:',
            err
          );

          this.errorFormulario =
            err?.error?.message ||
            'No se pudieron cargar los datos necesarios para asignar la cita.';

          this.cargandoDatosFormulario =
            false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CAMBIO DE ESPECIALIDAD
  // ==========================================

  cambiarEspecialidad(): void {

    this.nuevaCita.medicoId = 0;

    this.nuevaCita.fecha = '';

    this.nuevaCita.horarioId = 0;

    this.medicosDisponibles = [];

    this.horariosDisponibles = [];

    this.errorFormulario = '';


    if (!this.nuevaCita.especialidadId) {

      return;

    }


    this.cargandoMedicos = true;


    this.medicosService
      .buscarPorEspecialidad(
        this.nuevaCita.especialidadId
      )
      .subscribe({

        next: (data) => {

          this.medicosDisponibles =
            data.sort(
              (a, b) =>
                (
                  a.usuario?.nombreCompleto ||
                  ''
                )
                  .localeCompare(
                    b.usuario?.nombreCompleto ||
                    ''
                  )
            );


          this.cargandoMedicos = false;


          console.log(
            'Médicos de la especialidad:',
            this.medicosDisponibles
          );


          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar médicos:',
            err
          );

          this.errorFormulario =
            err?.error?.message ||
            'No se pudieron cargar los médicos de esta especialidad.';

          this.cargandoMedicos = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CAMBIO DE MÉDICO
  // ==========================================

  cambiarMedico(): void {

    this.nuevaCita.fecha = '';

    this.nuevaCita.horarioId = 0;

    this.horariosDisponibles = [];

    this.errorFormulario = '';

  }


  // ==========================================
  // CAMBIO DE FECHA
  // ==========================================

  cambiarFecha(): void {

    this.nuevaCita.horarioId = 0;

    this.horariosDisponibles = [];

    this.errorFormulario = '';


    if (
      !this.nuevaCita.medicoId ||
      !this.nuevaCita.fecha
    ) {

      return;

    }


    if (
      this.nuevaCita.fecha <
      this.fechaMinima
    ) {

      this.errorFormulario =
        'No puedes asignar una cita en una fecha pasada.';

      return;

    }


    this.cargarHorarios();

  }


  // ==========================================
  // CARGAR HORARIOS DISPONIBLES
  // ==========================================

  cargarHorarios(): void {

    this.cargandoHorarios = true;

    this.errorFormulario = '';


    this.horariosService
      .listarDisponibles(
        this.nuevaCita.medicoId,
        this.nuevaCita.fecha
      )
      .subscribe({

        next: (data) => {

          const ahora =
            new Date();


          this.horariosDisponibles =
            data
              .filter(
                horario => {

                  if (!horario.disponible) {

                    return false;

                  }


                  const inicio =
                    new Date(
                      horario.fechaHoraInicio
                    );


                  return (
                    inicio.getTime() >
                    ahora.getTime()
                  );

                }
              )
              .sort(
                (a, b) =>
                  a.fechaHoraInicio
                    .localeCompare(
                      b.fechaHoraInicio
                    )
              );


          this.cargandoHorarios = false;


          console.log(
            'Horarios disponibles:',
            this.horariosDisponibles
          );


          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar horarios:',
            err
          );

          this.errorFormulario =
            err?.error?.message ||
            'No se pudieron cargar los horarios disponibles.';

          this.cargandoHorarios = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // FECHA MÍNIMA
  // ==========================================

  get fechaMinima(): string {

    const hoy =
      new Date();


    const anio =
      hoy.getFullYear();


    const mes =
      String(
        hoy.getMonth() + 1
      )
        .padStart(
          2,
          '0'
        );


    const dia =
      String(
        hoy.getDate()
      )
        .padStart(
          2,
          '0'
        );


    return `${anio}-${mes}-${dia}`;

  }


  // ==========================================
  // GUARDAR CITA ADMINISTRATIVA
  // ==========================================

  guardarCita(): void {

    this.mensaje = '';

    this.errorFormulario = '';


    if (!this.nuevaCita.pacienteId) {

      this.errorFormulario =
        'Debes seleccionar un paciente.';

      return;

    }


    if (!this.nuevaCita.especialidadId) {

      this.errorFormulario =
        'Debes seleccionar una especialidad.';

      return;

    }


    if (!this.nuevaCita.medicoId) {

      this.errorFormulario =
        'Debes seleccionar un médico.';

      return;

    }


    if (!this.nuevaCita.fecha) {

      this.errorFormulario =
        'Debes seleccionar una fecha.';

      return;

    }


    if (!this.nuevaCita.horarioId) {

      this.errorFormulario =
        'Debes seleccionar un horario disponible.';

      return;

    }


    if (
      !this.nuevaCita.motivo.trim()
    ) {

      this.errorFormulario =
        'Debes indicar el motivo de la consulta.';

      return;

    }


    const datos = {

      pacienteId:
        this.nuevaCita.pacienteId,

      horarioId:
        this.nuevaCita.horarioId,

      motivo:
        this.nuevaCita.motivo.trim()

    };


    this.guardandoCita = true;


    this.citasService
      .crearAdministrativa(datos)
      .subscribe({

        next: (citaCreada) => {

          console.log(
            'Cita asignada:',
            citaCreada
          );


          this.guardandoCita = false;

          this.mostrarFormulario = false;


          this.mensaje =
            'Cita asignada correctamente.';


          this.cargarCitas();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al asignar cita:',
            err
          );


          this.errorFormulario =
            err?.error?.message ||
            'No se pudo asignar la cita. Comprueba que el horario continúe disponible.';


          this.guardandoCita = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CANCELAR FORMULARIO
  // ==========================================

  cancelarFormulario(): void {

    if (this.guardandoCita) {

      return;

    }


    this.mostrarFormulario = false;

    this.errorFormulario = '';

    this.medicosDisponibles = [];

    this.horariosDisponibles = [];

  }


  // ==========================================
  // MÉDICOS DEL FILTRO DE CITAS
  // ==========================================

  get medicos(): {
    id: number;
    nombre: string;
  }[] {

    const mapa =
      new Map<number, string>();


    this.citas.forEach(
      cita => {

        mapa.set(
          cita.medicoId,
          cita.medicoNombre
        );

      }
    );


    return Array
      .from(
        mapa,
        ([id, nombre]) => ({
          id,
          nombre
        })
      )
      .sort(
        (a, b) =>
          a.nombre.localeCompare(
            b.nombre
          )
      );

  }


  // ==========================================
  // CITAS FILTRADAS
  // ==========================================

  get citasFiltradas(): Cita[] {

    const paciente =
      this.filtroPaciente
        .trim()
        .toLowerCase();


    return this.citas.filter(
      cita => {

        const coincideMedico =
          !this.filtroMedico ||
          cita.medicoId ===
            this.filtroMedico;


        const coincidePaciente =
          !paciente ||
          cita.pacienteNombre
            .toLowerCase()
            .includes(
              paciente
            );


        const coincideFecha =
          !this.filtroFecha ||
          cita.fechaHoraInicio
            .slice(
              0,
              10
            ) ===
            this.filtroFecha;


        const coincideEstado =
          !this.filtroEstado ||
          cita.estado ===
            this.filtroEstado;


        return (
          coincideMedico &&
          coincidePaciente &&
          coincideFecha &&
          coincideEstado
        );

      }
    );

  }


  // ==========================================
  // RESUMEN
  // ==========================================

  get pendientes(): number {

    return this.citas.filter(
      cita =>
        cita.estado ===
        'PENDIENTE'
    ).length;

  }


  get completadas(): number {

    return this.citas.filter(
      cita =>
        cita.estado ===
        'COMPLETADA'
    ).length;

  }


  get canceladas(): number {

    return this.citas.filter(
      cita =>
        cita.estado ===
        'CANCELADA'
    ).length;

  }


  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  limpiarFiltros(): void {

    this.filtroMedico = 0;

    this.filtroPaciente = '';

    this.filtroFecha = '';

    this.filtroEstado = '';

  }

}