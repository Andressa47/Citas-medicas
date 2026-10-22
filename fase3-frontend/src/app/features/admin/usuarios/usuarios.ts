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

  // ==========================================
  // USUARIOS
  // ==========================================

  usuarios: any[] = [];


  // ==========================================
  // FILTROS
  // ==========================================

  busqueda = '';

  filtroRol = '';


  // ==========================================
  // ESTADO
  // ==========================================

  cargando = false;

  mostrarFormulario = false;

  mensaje = '';

  error = '';


  // ==========================================
  // NUEVO USUARIO
  // ==========================================

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


  // ==========================================
  // CARGAR USUARIOS
  // ==========================================

  cargarUsuarios(): void {

    this.cargando = true;

    this.error = '';


    this.usuariosService
      .listarTodos()
      .subscribe({

        next: (data: any[]) => {

          this.usuarios =
            [...data]
              .sort(
                (a: any, b: any) =>
                  (a.nombreCompleto || '')
                    .localeCompare(
                      b.nombreCompleto || ''
                    )
              );


          this.cargando = false;


          console.log(
            'Usuarios cargados:',
            this.usuarios
          );


          this.cdr.markForCheck();

        },


        error: (err: any) => {

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


  // ==========================================
  // USUARIOS FILTRADOS
  // ==========================================

  get usuariosFiltrados(): any[] {

    const texto =
      this.busqueda
        .trim()
        .toLowerCase();


    return this.usuarios.filter(
      (usuario: any) => {

        const nombre =
          (usuario.nombreCompleto || '')
            .toLowerCase();


        const email =
          (usuario.email || '')
            .toLowerCase();


        const id =
          String(
            usuario.id || ''
          );


        const coincideBusqueda =
          !texto ||
          nombre.includes(texto) ||
          email.includes(texto) ||
          id.includes(texto);


        const coincideRol =
          !this.filtroRol ||
          usuario.rol ===
            this.filtroRol;


        return (
          coincideBusqueda &&
          coincideRol
        );

      }
    );

  }


  // ==========================================
  // CONTADORES
  // ==========================================

  get totalUsuarios(): number {

    return this.usuarios.length;

  }


  get totalAdministradores(): number {

    return this.usuarios.filter(
      (usuario: any) =>
        usuario.rol === 'ROLE_ADMIN'
    ).length;

  }


  get totalMedicos(): number {

    return this.usuarios.filter(
      (usuario: any) =>
        usuario.rol === 'ROLE_DOCTOR'
    ).length;

  }


  get totalPacientes(): number {

    return this.usuarios.filter(
      (usuario: any) =>
        usuario.rol === 'ROLE_PATIENT'
    ).length;

  }


  // ==========================================
  // NOMBRE DEL ROL
  // ==========================================

  obtenerNombreRol(
    rol: string
  ): string {

    switch (rol) {

      case 'ROLE_ADMIN':
        return 'Administrador';

      case 'ROLE_DOCTOR':
        return 'Médico';

      case 'ROLE_PATIENT':
        return 'Paciente';

      case 'ROLE_NURSE':
        return 'Enfermería';

      case 'ROLE_SECRETARY':
        return 'Secretaría';

      default:
        return rol || 'Sin rol';

    }

  }


  // ==========================================
  // CLASE DEL ROL
  // ==========================================

  obtenerClaseRol(
    rol: string
  ): string {

    switch (rol) {

      case 'ROLE_ADMIN':
        return 'admin';

      case 'ROLE_DOCTOR':
        return 'doctor';

      case 'ROLE_PATIENT':
        return 'patient';

      case 'ROLE_NURSE':
        return 'nurse';

      case 'ROLE_SECRETARY':
        return 'secretary';

      default:
        return 'default';

    }

  }


  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  limpiarFiltros(): void {

    this.busqueda = '';

    this.filtroRol = '';

  }


  // ==========================================
  // FORMULARIO
  // ==========================================

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


  // ==========================================
  // GUARDAR USUARIO
  // ==========================================

  guardarUsuario(): void {

    this.mensaje = '';

    this.error = '';


    if (
      !this.nuevoUsuario
        .nombreCompleto
        .trim() ||
      !this.nuevoUsuario
        .email
        .trim() ||
      !this.nuevoUsuario
        .password
        .trim()
    ) {

      this.error =
        'Todos los campos son obligatorios.';


      return;

    }


    this.usuariosService
      .crear(
        this.nuevoUsuario
      )
      .subscribe({

        next: (usuarioCreado: any) => {

          console.log(
            'Usuario creado:',
            usuarioCreado
          );


          this.mensaje =
            'Usuario creado correctamente.';


          this.mostrarFormulario =
            false;


          this.cargarUsuarios();


          this.cdr.markForCheck();

        },


        error: (err: any) => {

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


  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================

  eliminarUsuario(
    usuario: any
  ): void {

    if (!usuario.id) {

      return;

    }


    const confirmar =
      confirm(
        `¿Deseas eliminar al usuario "${usuario.nombreCompleto}"?`
      );


    if (!confirmar) {

      return;

    }


    this.usuariosService
      .eliminar(
        usuario.id
      )
      .subscribe({

        next: () => {

          this.mensaje =
            'Usuario eliminado correctamente.';


          this.cargarUsuarios();


          this.cdr.markForCheck();

        },


        error: (err: any) => {

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