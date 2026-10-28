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

import {
  BloqueHorarioSemanal,
  DiaSemana,
  HorariosService
} from '../../../core/services/horarios';

import {
  MedicosService
} from '../../../core/services/medicos';

interface OpcionDia {
  valor: DiaSemana;
  nombre: string;
}

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
  bloques: BloqueHorarioSemanal[] = [];

  cargando = false;
  cargandoConfiguracion = false;
  guardando = false;

  mensaje = '';
  error = '';

  filtroForm: FormGroup;
  configuracionForm: FormGroup;
  bloqueForm: FormGroup;

  readonly dias: OpcionDia[] = [
    { valor: 'MONDAY', nombre: 'Lunes' },
    { valor: 'TUESDAY', nombre: 'Martes' },
    { valor: 'WEDNESDAY', nombre: 'Miércoles' },
    { valor: 'THURSDAY', nombre: 'Jueves' },
    { valor: 'FRIDAY', nombre: 'Viernes' },
    { valor: 'SATURDAY', nombre: 'Sábado' },
    { valor: 'SUNDAY', nombre: 'Domingo' }
  ];

  constructor(
    private fb: FormBuilder,
    private horariosService: HorariosService,
    private medicosService: MedicosService,
    private cdr: ChangeDetectorRef
  ) {

    this.filtroForm = this.fb.group({
      medicoId: [null, Validators.required],
      fecha: ['']
    });

    this.configuracionForm = this.fb.group({
      duracionConsultaMinutos: [
        30,
        [
          Validators.required,
          Validators.min(10),
          Validators.max(240)
        ]
      ]
    });

    this.bloqueForm = this.fb.group({
      diaSemana: ['MONDAY', Validators.required],
      horaInicio: ['08:00', Validators.required],
      horaFin: ['12:00', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  get medicoSeleccionadoId(): number | null {
    return this.filtroForm.get('medicoId')?.value ?? null;
  }

  cargarMedicos(): void {
    this.medicosService.listarTodos().subscribe({
      next: (data) => {
        this.medicos = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
        this.error = 'No se pudieron cargar los médicos.';
        this.cdr.markForCheck();
      }
    });
  }

  alCambiarMedico(): void {
    this.mensaje = '';
    this.error = '';
    this.horarios = [];
    this.bloques = [];

    if (!this.medicoSeleccionadoId) {
      return;
    }

    this.cargarConfiguracion();
    this.buscarHorarios();
  }

  cargarConfiguracion(): void {
    const medicoId = this.medicoSeleccionadoId;

    if (!medicoId) {
      return;
    }

    this.cargandoConfiguracion = true;

    this.horariosService
      .obtenerConfiguracion(medicoId)
      .subscribe({
        next: (configuracion) => {
          this.configuracionForm.patchValue({
            duracionConsultaMinutos:
              configuracion.duracionConsultaMinutos
          });

          this.bloques = [...configuracion.bloques];
          this.cargandoConfiguracion = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(
            'Error al cargar configuración:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo cargar la configuración del médico.';

          this.cargandoConfiguracion = false;
          this.cdr.markForCheck();
        }
      });
  }

  agregarBloque(): void {
    this.error = '';
    this.mensaje = '';

    if (this.bloqueForm.invalid) {
      this.bloqueForm.markAllAsTouched();
      this.error = 'Completa correctamente el bloque de atención.';
      return;
    }

    const valores = this.bloqueForm.getRawValue();

    if (valores.horaFin <= valores.horaInicio) {
      this.error =
        'La hora de fin debe ser posterior a la hora de inicio.';
      return;
    }

    const nuevo: BloqueHorarioSemanal = {
      diaSemana: valores.diaSemana as DiaSemana,
      horaInicio: valores.horaInicio,
      horaFin: valores.horaFin
    };

    const seCruza = this.bloques.some(
      bloque =>
        bloque.diaSemana === nuevo.diaSemana &&
        nuevo.horaInicio < bloque.horaFin &&
        nuevo.horaFin > bloque.horaInicio
    );

    if (seCruza) {
      this.error =
        'Ese bloque se cruza con otro horario del mismo día.';
      return;
    }

    this.bloques = [
      ...this.bloques,
      nuevo
    ].sort((a, b) => {
      const diaA = this.indiceDia(a.diaSemana);
      const diaB = this.indiceDia(b.diaSemana);

      if (diaA !== diaB) {
        return diaA - diaB;
      }

      return a.horaInicio.localeCompare(b.horaInicio);
    });

    this.bloqueForm.patchValue({
      horaInicio: '08:00',
      horaFin: '12:00'
    });

    this.cdr.markForCheck();
  }

  eliminarBloque(index: number): void {
    this.bloques = this.bloques.filter(
      (_, posicion) => posicion !== index
    );

    this.mensaje = '';
    this.error = '';
    this.cdr.markForCheck();
  }

  guardarConfiguracion(): void {
    this.mensaje = '';
    this.error = '';

    const medicoId = this.medicoSeleccionadoId;

    if (!medicoId) {
      this.error = 'Debes seleccionar un médico.';
      return;
    }

    if (this.configuracionForm.invalid) {
      this.configuracionForm.markAllAsTouched();
      this.error =
        'La duración debe estar entre 10 y 240 minutos.';
      return;
    }

    if (this.bloques.length === 0) {
      this.error =
        'Debes agregar al menos un bloque semanal de atención.';
      return;
    }

    const duracion = Number(
      this.configuracionForm
        .get('duracionConsultaMinutos')
        ?.value
    );

    const bloqueMuyCorto = this.bloques.find(
      bloque =>
        this.minutosEntre(
          bloque.horaInicio,
          bloque.horaFin
        ) < duracion
    );

    if (bloqueMuyCorto) {
      this.error =
        `El bloque de ${this.nombreDia(bloqueMuyCorto.diaSemana)} ` +
        'es menor que la duración de una consulta.';
      return;
    }

    this.guardando = true;

    this.horariosService
      .guardarConfiguracion(
        medicoId,
        {
          duracionConsultaMinutos: duracion,
          bloques: this.bloques.map(bloque => ({
            diaSemana: bloque.diaSemana,
            horaInicio: bloque.horaInicio,
            horaFin: bloque.horaFin
          }))
        }
      )
      .subscribe({
        next: (configuracion) => {
          this.bloques = [...configuracion.bloques];
          this.guardando = false;

          this.mensaje =
            'Configuración guardada correctamente. ' +
            `${configuracion.horariosGenerados} horarios nuevos fueron generados.`;

          this.buscarHorarios();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(
            'Error al guardar configuración:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo guardar la configuración.';

          this.guardando = false;
          this.cdr.markForCheck();
        }
      });
  }

  buscarHorarios(): void {
    this.error = '';

    const medicoId = this.medicoSeleccionadoId;
    const fecha = this.filtroForm.get('fecha')?.value;

    if (!medicoId) {
      this.filtroForm.get('medicoId')?.markAsTouched();
      this.error = 'Debes seleccionar un médico.';
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
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al cargar horarios:', err);

          this.error =
            err?.error?.message ||
            'No se pudieron cargar los horarios.';

          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
  }

  nombreDia(dia: DiaSemana): string {
    return this.dias.find(
      opcion => opcion.valor === dia
    )?.nombre ?? dia;
  }

  private indiceDia(dia: DiaSemana): number {
    return this.dias.findIndex(
      opcion => opcion.valor === dia
    );
  }

  private minutosEntre(inicio: string, fin: string): number {
    const [horaInicio, minutoInicio] =
      inicio.split(':').map(Number);

    const [horaFin, minutoFin] =
      fin.split(':').map(Number);

    return (horaFin * 60 + minutoFin)
      - (horaInicio * 60 + minutoInicio);
  }
}
