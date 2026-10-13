import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  UsuariosService
} from '../../../core/services/usuarios';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarios: any[] = [];

  cargando = false;

  mostrarFormulario = false;

  mensaje = '';

  error = '';

  nuevoUsuario = {
    nombreCompleto: '',
    email: '',
    password: '',
    rol: 'ROLE_DOCTOR'
  };


  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarUsuarios();

  }


  cargarUsuarios(): void {

    this.cargando = true;

    this.error = '';

    this.usuariosService
      .listarTodos()
      .subscribe({

        next: (data) => {

          this.usuarios = data;

          this.cargando = false;

          console.log(
            'Usuarios cargados:',
            data
          );

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al cargar usuarios:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudieron cargar los usuarios.';

          this.cargando = false;

          this.cdr.markForCheck();

        }

      });

  }


  abrirFormulario(): void {

    this.nuevoUsuario = {
      nombreCompleto: '',
      email: '',
      password: '',
      rol: 'ROLE_DOCTOR'
    };

    this.mostrarFormulario = true;

    this.mensaje = '';

    this.error = '';

  }


  cancelarFormulario(): void {

    this.mostrarFormulario = false;

    this.error = '';

  }


  guardarUsuario(): void {

    this.mensaje = '';

    this.error = '';


    if (
      !this.nuevoUsuario.nombreCompleto.trim() ||
      !this.nuevoUsuario.email.trim() ||
      !this.nuevoUsuario.password.trim()
    ) {

      this.error =
        'Todos los campos son obligatorios.';

      return;
    }


    this.usuariosService
      .crear(this.nuevoUsuario)
      .subscribe({

        next: (usuarioCreado) => {

          console.log(
            'Usuario creado:',
            usuarioCreado
          );

          this.mensaje =
            'Usuario creado correctamente.';

          this.mostrarFormulario = false;

          this.cargarUsuarios();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al crear usuario:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo crear el usuario.';

          this.cdr.markForCheck();

        }

      });

  }


  eliminarUsuario(usuario: any): void {

    if (!usuario.id) {
      return;
    }

    const confirmar = confirm(
      `¿Deseas eliminar al usuario "${usuario.nombreCompleto}"?`
    );

    if (!confirmar) {
      return;
    }


    this.usuariosService
      .eliminar(usuario.id)
      .subscribe({

        next: () => {

          this.mensaje =
            'Usuario eliminado correctamente.';

          this.cargarUsuarios();

          this.cdr.markForCheck();

        },

        error: (err) => {

          console.error(
            'Error al eliminar usuario:',
            err
          );

          this.error =
            err?.error?.message ||
            'No se pudo eliminar el usuario.';

          this.cdr.markForCheck();

        }

      });

  }

}