import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

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

  credenciales = {
    email: '',
    password: ''
  };

  mensajeError = '';

  cargando = false;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // ==========================================
  // INICIAR SESIÓN
  // ==========================================

  iniciarSesion(): void {

    this.mensajeError = '';

    this.cargando = true;


    // ========================================
    // LIMPIAR CUALQUIER SESIÓN ANTERIOR
    // ========================================

    localStorage.removeItem('token');
    localStorage.removeItem('rol');


    // ========================================
    // LLAMAR AL BACKEND
    // ========================================

    this.authService
      .login(this.credenciales)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Login exitoso:',
            respuesta
          );


          // ==================================
          // ADMINISTRADOR
          // ==================================

          if (
            respuesta.rol === 'ROLE_ADMIN'
          ) {

            this.authService.guardarToken(
              respuesta.token,
              respuesta.rol
            );

            this.cargando = false;

            this.router.navigate([
              '/admin'
            ]);

            return;
          }


          // ==================================
          // MÉDICO
          // ==================================

          if (
            respuesta.rol === 'ROLE_DOCTOR'
          ) {

            this.authService.guardarToken(
              respuesta.token,
              respuesta.rol
            );

            this.cargando = false;

            this.router.navigate([
              '/medico'
            ]);

            return;
          }


          // ==================================
          // PACIENTE
          // ==================================

          if (
            respuesta.rol === 'ROLE_PATIENT'
          ) {

            this.cargando = false;

            this.mensajeError =
              'El portal web es exclusivo para personal administrativo y médicos. Los pacientes deben utilizar la aplicación móvil.';

            return;
          }


          // ==================================
          // CUALQUIER OTRO ROL
          // ==================================

          this.cargando = false;

          this.mensajeError =
            'No tienes autorización para acceder al portal web.';

        },


        // ====================================
        // ERROR DE LOGIN
        // ====================================

        error: (err) => {

          console.error(
            'Error de login:',
            err
          );

          this.cargando = false;

          this.mensajeError =
            'Usuario o contraseña incorrectos';

        }

      });

  }

}