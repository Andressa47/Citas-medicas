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
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  CitasService
} from '../../../core/services/citas';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './consultas.html',
  styleUrl: './consultas.css'
})
export class Consultas implements OnInit {

  cita: any = null;

  cargando = true;
  guardando = false;

  error = '';
  mensaje = '';

  consultaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private citasService: CitasService,
    private cdr: ChangeDetectorRef
  ) {

    this.consultaForm =
      this.fb.group({

        diagnostico: [
          '',
          [
            Validators.required,
            Validators.minLength(5)
          ]
        ],

        receta: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ]

      });
  }

  ngOnInit(): void {
    this.obtenerCita();
  }

  // ==========================================
  // CARGAR CITA
  // ==========================================

  obtenerCita(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if (!id) {

      this.error =
        'No se proporcionó una cita válida.';

      this.cargando = false;

      return;
    }

    this.citasService
      .buscarPorId(id)
      .subscribe({

        next: (data) => {

          this.cita = data;

          if (data.estado === 'COMPLETADA') {

            this.consultaForm.patchValue({

              diagnostico:
                data.diagnostico || '',

              receta:
                data.receta || ''

            });

            this.consultaForm.disable();
          }

          this.cargando = false;

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(
            'Error al cargar cita:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo cargar la cita.';

          this.cargando = false;

          this.cdr.markForCheck();
        }

      });
  }

  // ==========================================
  // COMPLETAR CONSULTA
  // ==========================================

  completarConsulta(): void {

    this.error = '';
    this.mensaje = '';

    if (this.consultaForm.invalid) {

      this.consultaForm
        .markAllAsTouched();

      this.error =
        'Debes completar correctamente el diagnóstico y la receta.';

      return;
    }

    if (!this.cita?.id) {

      this.error =
        'No se encontró la cita.';

      return;
    }

    const datos = {

      diagnostico:
        this.consultaForm
          .value
          .diagnostico
          .trim(),

      receta:
        this.consultaForm
          .value
          .receta
          .trim()

    };

    this.guardando = true;

    this.citasService
      .registrarDiagnostico(
        this.cita.id,
        datos
      )
      .subscribe({

        next: (data) => {

          this.cita = data;

          this.mensaje =
            'Consulta completada correctamente.';

          this.guardando = false;

          this.consultaForm.disable();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(
            'Error al registrar diagnóstico:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo completar la consulta.';

          this.guardando = false;

          this.cdr.markForCheck();
        }

      });
  }

  // ==========================================
  // VOLVER A AGENDA
  // ==========================================

  volver(): void {

    this.router.navigate([
      '/medico'
    ]);
  }
}