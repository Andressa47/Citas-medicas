import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  medicalOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonIcon
  ],
})
export class LoginPage {

  email = '';
  password = '';
  mostrarPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      medicalOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  cambiarVisibilidadPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {

    this.authService.login(this.email, this.password)
      .subscribe({

        next: (respuesta) => {

          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('email', respuesta.email);
          localStorage.setItem('rol', respuesta.rol);

          alert('Inicio de sesión correcto');

          this.router.navigate(['/tabs/tab1']);
        },

        error: (error) => {

          console.error(error);

          alert(
            'No se pudo iniciar sesión. Código: ' +
            error.status
          );

        }

      });

  }

}