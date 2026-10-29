import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../../../core/services/auth';


@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css'
})
export class CambiarPassword {

  formulario = {

    passwordActual: '',

    nuevaPassword: '',

    confirmarPassword: ''

  };


  guardando = false;

  mensaje = '';

  error = '';


  constructor(
    private authService:
      AuthService,

    private cdr:
      ChangeDetectorRef
  ) {}


  cambiarPassword(): void {

    this.mensaje = '';

    this.error = '';


    if (
      !this.formulario.passwordActual ||
      !this.formulario.nuevaPassword ||
      !this.formulario.confirmarPassword
    ) {

      this.error =
        'Debes completar todos los campos.';

      return;

    }


    if (
      this.formulario.nuevaPassword !==
      this.formulario.confirmarPassword
    ) {

      this.error =
        'Las nuevas contraseñas no coinciden.';

      return;

    }


    if (
      this.formulario.nuevaPassword ===
      this.formulario.passwordActual
    ) {

      this.error =
        'La nueva contraseña debe ser diferente a la actual.';

      return;

    }


    this.guardando = true;


    this.authService
      .cambiarPassword(
        this.formulario
      )
      .subscribe({

        next: (respuesta: any) => {

          this.mensaje =
            respuesta?.mensaje ||
            'Contraseña actualizada correctamente.';


          this.formulario = {

            passwordActual: '',

            nuevaPassword: '',

            confirmarPassword: ''

          };


          this.guardando =
            false;


          this.cdr.detectChanges();

        },


        error: (err: any) => {

          console.error(
            'Error cambiando contraseña:',
            err
          );


          this.error =
            err?.error?.mensaje ||
            err?.error?.message ||
            'No se pudo actualizar la contraseña.';


          this.guardando =
            false;


          this.cdr.detectChanges();

        }

      });

  }

}