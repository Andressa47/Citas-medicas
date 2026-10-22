import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // ==========================================
  // LOGIN
  // ==========================================

  credenciales = {
    email: '',
    password: ''
  };


  // ==========================================
  // CAMBIO OBLIGATORIO
  // ==========================================

  requiereCambioPassword =
    false;


  nuevaPassword =
    '';


  confirmarPassword =
    '';


  // ==========================================
  // ESTADO
  // ==========================================

  mensajeError =
    '';


  cargando =
    false;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // ==========================================
  // INICIAR SESIÓN
  // ==========================================

  iniciarSesion(): void {

    this.mensajeError =
      '';


    this.cargando =
      true;


    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'rol'
    );


    this.authService
      .login(
        this.credenciales
      )
      .subscribe({

        next: (respuesta: any) => {

          console.log(
            'Login exitoso:',
            respuesta
          );


          // ==================================
          // CAMBIO OBLIGATORIO
          // ==================================

          if (
            respuesta.debeCambiarPassword
          ) {

            this.requiereCambioPassword =
              true;


            this.cargando =
              false;


            return;
          }


          this.procesarAcceso(
            respuesta
          );

        },


        error: (err: any) => {

          console.error(
            'Error de login:',
            err
          );


          this.cargando =
            false;


          this.mensajeError =
            'Usuario o contraseña incorrectos';

        }

      });

  }


  // ==========================================
  // CAMBIAR CONTRASEÑA
  // ==========================================

  cambiarPassword(): void {

    this.mensajeError =
      '';


    if (
      !this.nuevaPassword ||
      !this.confirmarPassword
    ) {

      this.mensajeError =
        'Debes completar ambos campos.';


      return;
    }


    if (
      this.nuevaPassword !==
      this.confirmarPassword
    ) {

      this.mensajeError =
        'Las nuevas contraseñas no coinciden.';


      return;
    }


    this.cargando =
      true;


    const datos = {

      email:
        this.credenciales.email,

      passwordActual:
        this.credenciales.password,

      nuevaPassword:
        this.nuevaPassword,

      confirmarPassword:
        this.confirmarPassword

    };


    this.authService
      .cambiarPasswordObligatoria(
        datos
      )
      .subscribe({

        next: () => {

          /*
           * Usamos la nueva contraseña para
           * iniciar sesión automáticamente.
           */

          this.credenciales.password =
            this.nuevaPassword;


          this.nuevaPassword =
            '';

          this.confirmarPassword =
            '';


          this.requiereCambioPassword =
            false;


          this.cargando =
            false;


          this.iniciarSesion();

        },


        error: (err: any) => {

          console.error(
            'Error cambiando contraseña:',
            err
          );


          this.cargando =
            false;


          this.mensajeError =
            err?.error?.mensaje ||
            'No se pudo cambiar la contraseña.';

        }

      });

  }


  // ==========================================
  // PROCESAR ACCESO
  // ==========================================

  private procesarAcceso(
    respuesta: any
  ): void {

    // ========================================
    // ADMINISTRADOR
    // ========================================

    if (
      respuesta.rol ===
      'ROLE_ADMIN'
    ) {

      this.authService
        .guardarToken(
          respuesta.token,
          respuesta.rol
        );


      this.cargando =
        false;


      this.router.navigate([
        '/admin'
      ]);


      return;
    }


    // ========================================
    // MÉDICO
    // ========================================

    if (
      respuesta.rol ===
      'ROLE_DOCTOR'
    ) {

      this.authService
        .guardarToken(
          respuesta.token,
          respuesta.rol
        );


      this.cargando =
        false;


      this.router.navigate([
        '/medico'
      ]);


      return;
    }


    // ========================================
    // PACIENTE
    // ========================================

    if (
      respuesta.rol ===
      'ROLE_PATIENT'
    ) {

      this.cargando =
        false;


      this.mensajeError =
        'El portal web es exclusivo para personal administrativo y médicos. Los pacientes deben utilizar la aplicación móvil.';


      return;
    }


    // ========================================
    // OTRO ROL
    // ========================================

    this.cargando =
      false;


    this.mensajeError =
      'No tienes autorización para acceder al portal web.';

  }

}