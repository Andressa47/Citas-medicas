import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  personCircleOutline,
  mailOutline,
  shieldCheckmarkOutline,
  logOutOutline,
  arrowBackOutline
} from 'ionicons/icons';

import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon
  ]
})
export class PerfilPacientePage implements OnInit {

  nombrePaciente = 'Paciente';
  email = '';
  rol = '';

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    addIcons({
      personCircleOutline,
      mailOutline,
      shieldCheckmarkOutline,
      logOutOutline,
      arrowBackOutline
    });
  }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {

    this.usuarioService.obtenerMiPerfil().subscribe({

      next: (usuario) => {

        this.nombrePaciente =
          usuario.nombreCompleto || 'Paciente';

        this.email =
          usuario.email || '';

        this.rol =
          usuario.rol || 'ROLE_PATIENT';

      },

      error: (error) => {

        console.error(
          'Error al cargar el perfil del paciente:',
          error
        );

      }

    });
  }

  regresar() {
    this.router.navigate(['/tabs/tab1']);
  }

  cerrarSesion() {

    const confirmar = confirm(
      '¿Deseas cerrar sesión?'
    );

    if (!confirmar) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');

    this.router.navigate(['/login']);
  }
}