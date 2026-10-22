import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  PerfilMedicoService
} from '../../../core/services/perfil-medico';


@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './perfil-medico.html',
  styleUrl: './perfil-medico.css'
})
export class PerfilMedico implements OnInit {

  perfil: any = null;


  formulario = {

    biografia: '',

    telefonoProfesional: '',

    aniosExperiencia: 0,

    formacionAcademica: '',

    idiomas: '',

    ubicacionConsultorio: ''

  };


  cargando = true;

  guardando = false;

  mensaje = '';

  error = '';


  constructor(
    private perfilService:
      PerfilMedicoService,

    private cdr:
      ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarPerfil();

  }


  cargarPerfil(): void {

    this.cargando = true;

    this.error = '';


    this.perfilService
      .obtenerMiPerfil()
      .subscribe({

        next: (data: any) => {

          this.perfil =
            data;


          this.cargarFormulario(
            data
          );


          this.cargando =
            false;


          this.cdr.detectChanges();

        },


        error: (err: any) => {

          console.error(
            'Error al cargar perfil:',
            err
          );


          this.error =
            err?.error?.message ||
            'No se pudo cargar el perfil profesional.';


          this.cargando =
            false;


          this.cdr.detectChanges();

        }

      });

  }


  cargarFormulario(
    data: any
  ): void {

    this.formulario = {

      biografia:
        data?.biografia ?? '',

      telefonoProfesional:
        data?.telefonoProfesional ?? '',

      aniosExperiencia:
        data?.aniosExperiencia ?? 0,

      formacionAcademica:
        data?.formacionAcademica ?? '',

      idiomas:
        data?.idiomas ?? '',

      ubicacionConsultorio:
        data?.ubicacionConsultorio ?? ''

    };

  }


  guardarPerfil(): void {

    this.mensaje = '';

    this.error = '';


    if (
      this.formulario
        .aniosExperiencia < 0 ||
      this.formulario
        .aniosExperiencia > 80
    ) {

      this.error =
        'Los años de experiencia deben estar entre 0 y 80.';


      return;

    }


    this.guardando =
      true;


    this.perfilService
      .actualizarMiPerfil(
        this.formulario
      )
      .subscribe({

        next: (data: any) => {

          this.perfil =
            data;


          this.cargarFormulario(
            data
          );


          this.mensaje =
            'Perfil profesional actualizado correctamente.';


          this.guardando =
            false;


          this.cdr.detectChanges();

        },


        error: (err: any) => {

          console.error(
            'Error actualizando perfil:',
            err
          );


          this.error =
            err?.error?.message ||
            err?.error?.mensaje ||
            'No se pudo actualizar el perfil.';


          this.guardando =
            false;


          this.cdr.detectChanges();

        }

      });

  }


  cancelarCambios(): void {

    this.mensaje = '';

    this.error = '';


    if (this.perfil) {

      this.cargarFormulario(
        this.perfil
      );

    }

  }


  obtenerInicial(): string {

    return (
      this.perfil
        ?.nombreCompleto
        ?.charAt(0)
        ?.toUpperCase()
      || 'M'
    );

  }

}