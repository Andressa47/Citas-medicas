import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  MedicosService
} from '../../../core/services/medicos';

import {
  CitasService
} from '../../../core/services/citas';

import {
  ChatMedico
} from '../../chat-medico/chat-medico';

import { PerfilMedico } from '../perfil-medico/perfil-medico';

@Component({
  selector: 'app-panel-medico',
  standalone: true,
  imports: [
  CommonModule,
  ChatMedico,
  PerfilMedico
],
  templateUrl: './panel-medico.html',
  styleUrl: './panel-medico.css'
})
export class PanelMedico implements OnInit {

  // ==========================================
  // VISTA ACTUAL
  // ==========================================

  vistaActual: 'agenda' | 'mensajes' | 'perfil' = 'agenda';


  // ==========================================
  // MÉDICO
  // ==========================================

  medico: any = null;


  // ==========================================
  // CITAS
  // ==========================================

  citas: any[] = [];

  citasPendientes: any[] = [];

  citasHoy: any[] = [];

  proximasCitas: any[] = [];


  // ==========================================
  // ESTADO
  // ==========================================

  cargando = true;

  error = '';


  constructor(
    private medicosService: MedicosService,
    private citasService: CitasService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarMedicoActual();

  }


  // ==========================================
  // CAMBIAR VISTA
  // ==========================================

  cambiarVista(
  vista: 'agenda' | 'mensajes' | 'perfil'
): void {
  this.vistaActual = vista;
}


  // ==========================================
  // OBTENER EMAIL DEL JWT
  // ==========================================

  obtenerEmailDelToken(): string | null {

    const token =
      localStorage.getItem('token');


    if (!token) {

      return null;

    }


    try {

      const payload =
        JSON.parse(
          atob(
            token.split('.')[1]
          )
        );


      return payload.sub || null;

    } catch (error) {

      console.error(
        'No se pudo leer el token:',
        error
      );


      return null;

    }

  }


  // ==========================================
  // OBTENER FECHA ACTUAL
  // ==========================================

  obtenerFechaHoy(): string {

    const hoy =
      new Date();


    const anio =
      hoy.getFullYear();


    const mes =
      String(
        hoy.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const dia =
      String(
        hoy.getDate()
      ).padStart(
        2,
        '0'
      );


    return `${anio}-${mes}-${dia}`;

  }


  // ==========================================
  // IDENTIFICAR MÉDICO LOGUEADO
  // ==========================================

  cargarMedicoActual(): void {

    const email =
      this.obtenerEmailDelToken();


    if (!email) {

      this.error =
        'No se pudo identificar al usuario autenticado.';


      this.cargando = false;


      this.cdr.markForCheck();


      return;

    }


    this.medicosService
      .listarTodos()
      .subscribe({

        next: (medicos: any[]) => {

          this.medico =
            medicos.find(
              (medico: any) =>
                medico.usuario?.email === email
            );


          if (!this.medico) {

            this.error =
              'No se encontró el perfil médico del usuario autenticado.';


            this.cargando = false;


            this.cdr.markForCheck();


            return;

          }


          this.cargarCitas();

        },


        error: (err: any) => {

          console.error(
            'Error al cargar médico:',
            err
          );


          this.error =
            'No se pudo cargar el perfil médico.';


          this.cargando = false;


          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CARGAR CITAS
  // ==========================================

  cargarCitas(): void {

    if (!this.medico?.id) {

      return;

    }


    this.citasService
      .listarPorMedico(
        this.medico.id
      )
      .subscribe({

        next: (data: any[]) => {

          this.citas =
            data;


          this.citasPendientes =
            data.filter(
              (cita: any) =>
                cita.estado === 'PENDIENTE'
            );


          const hoy =
            this.obtenerFechaHoy();


          this.citasHoy =
            this.citasPendientes
              .filter(
                (cita: any) =>
                  cita.fechaHoraInicio
                    ?.substring(
                      0,
                      10
                    ) === hoy
              )
              .sort(
                (a: any, b: any) =>
                  a.fechaHoraInicio
                    .localeCompare(
                      b.fechaHoraInicio
                    )
              );


          this.proximasCitas =
            this.citasPendientes
              .filter(
                (cita: any) =>
                  cita.fechaHoraInicio
                    ?.substring(
                      0,
                      10
                    ) > hoy
              )
              .sort(
                (a: any, b: any) =>
                  a.fechaHoraInicio
                    .localeCompare(
                      b.fechaHoraInicio
                    )
              );


          this.cargando = false;


          this.cdr.markForCheck();

        },


        error: (err: any) => {

          console.error(
            'Error al cargar citas:',
            err
          );


          this.error =
            'No se pudieron cargar las citas.';


          this.cargando = false;


          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ABRIR CONSULTA
  // ==========================================

  atenderPaciente(
    cita: any
  ): void {

    this.router.navigate(
      [
        '/medico/consultas',
        cita.id
      ]
    );

  }


  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  cerrarSesion(): void {

    localStorage.removeItem(
      'token'
    );


    localStorage.removeItem(
      'rol'
    );


    this.router.navigate(
      [
        '/login'
      ]
    );

  }

}