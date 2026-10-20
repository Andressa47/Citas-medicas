import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ChatService
} from '../../core/services/chat';

import {
  CitasService
} from '../../core/services/citas';


@Component({
  selector: 'app-chat-medico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-medico.html',
  styleUrl: './chat-medico.css'
})
export class ChatMedico
implements OnInit, OnDestroy {

  // ==========================================
  // MÉDICO AUTENTICADO
  // ==========================================

  @Input()
  medico: any;


  // ==========================================
  // CONTENEDOR DE MENSAJES
  // ==========================================

  @ViewChild('mensajesContenedor')
  mensajesContenedor?:
    ElementRef<HTMLDivElement>;


  // ==========================================
  // DATOS
  // ==========================================

  conversaciones: any[] = [];

  mensajes: any[] = [];

  pacientes: {
    id: number;
    nombre: string;
  }[] = [];


  // ==========================================
  // SELECCIONES
  // ==========================================

  conversacionSeleccionada:
    any = null;

  pacienteSeleccionado = 0;

  nuevoMensaje = '';


  // ==========================================
  // ESTADO
  // ==========================================

  cargandoConversaciones = true;

  cargandoMensajes = false;

  creandoConversacion = false;

  enviando = false;

  error = '';


  // ==========================================
  // ACTUALIZACIÓN AUTOMÁTICA
  // ==========================================

  private intervaloActualizacion:
    ReturnType<typeof setInterval>
    | null = null;


  constructor(
    private chatService: ChatService,
    private citasService: CitasService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarPacientes();

    this.cargarConversaciones(
      true
    );


    this.intervaloActualizacion =
      setInterval(
        () => {

          this.refrescarChat();

        },
        1500
      );

  }


  ngOnDestroy(): void {

    if (
      this.intervaloActualizacion
    ) {

      clearInterval(
        this.intervaloActualizacion
      );

    }

  }


  // ==========================================
  // CARGAR PACIENTES DEL MÉDICO
  // ==========================================

  cargarPacientes(): void {

    if (!this.medico?.id) {

      return;

    }


    this.citasService
      .listarPorMedico(
        this.medico.id
      )
      .subscribe({

        next: (citas: any[]) => {

          const mapa =
            new Map<number, string>();


          citas.forEach(
            (cita: any) => {

              if (
                cita.pacienteId &&
                cita.pacienteNombre
              ) {

                mapa.set(
                  cita.pacienteId,
                  cita.pacienteNombre
                );

              }

            }
          );


          this.pacientes =
            Array.from(
              mapa.entries()
            )
              .map(
                ([id, nombre]) => ({
                  id,
                  nombre
                })
              )
              .sort(
                (a, b) =>
                  a.nombre.localeCompare(
                    b.nombre
                  )
              );


          this.cdr.markForCheck();

        },


        error: (err) => {

          console.error(
            'Error al cargar pacientes:',
            err
          );

        }

      });

  }


  // ==========================================
  // CARGAR CONVERSACIONES
  // ==========================================

  cargarConversaciones(
    seleccionarPrimera = false
  ): void {

    this.chatService
      .listarConversaciones()
      .subscribe({

        next: (data: any[]) => {

          this.conversaciones =
            data;


          if (
            this.conversacionSeleccionada
          ) {

            const actualizada =
              this.conversaciones
                .find(
                  conversacion =>
                    conversacion.id ===
                    this.conversacionSeleccionada.id
                );


            if (actualizada) {

              this.conversacionSeleccionada =
                actualizada;

            }

          } else if (
            seleccionarPrimera &&
            this.conversaciones.length > 0
          ) {

            this.seleccionarConversacion(
              this.conversaciones[0]
            );

          }


          this.cargandoConversaciones =
            false;


          this.cdr.markForCheck();

        },


        error: (err) => {

          console.error(
            'Error al cargar conversaciones:',
            err
          );


          this.error =
            'No se pudieron cargar las conversaciones.';


          this.cargandoConversaciones =
            false;


          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CREAR O RECUPERAR CONVERSACIÓN
  // ==========================================

  crearConversacion(): void {

    if (
      !this.pacienteSeleccionado
    ) {

      this.error =
        'Selecciona un paciente.';


      return;

    }


    this.error = '';

    this.creandoConversacion = true;


    this.chatService
      .crearConversacion({
        pacienteId:
          this.pacienteSeleccionado
      })
      .subscribe({

        next: (conversacion: any) => {

          this.creandoConversacion =
            false;


          this.conversacionSeleccionada =
            conversacion;


          this.pacienteSeleccionado =
            0;


          this.cargarConversaciones();


          this.cargarMensajes();


          this.cdr.markForCheck();

        },


        error: (err) => {

          console.error(
            'Error al crear conversación:',
            err
          );


          this.error =
            err?.error?.message ||
            'No se pudo iniciar la conversación.';


          this.creandoConversacion =
            false;


          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // SELECCIONAR CONVERSACIÓN
  // ==========================================

  seleccionarConversacion(
    conversacion: any
  ): void {

    this.conversacionSeleccionada =
      conversacion;


    this.mensajes = [];


    this.cargarMensajes();

  }


  // ==========================================
  // CARGAR MENSAJES
  // ==========================================

  cargarMensajes(
    silencioso = false
  ): void {

    if (
      !this.conversacionSeleccionada
    ) {

      return;

    }


    if (!silencioso) {

      this.cargandoMensajes =
        true;

    }


    this.chatService
      .listarMensajes(
        this.conversacionSeleccionada.id
      )
      .subscribe({

        next: (data: any[]) => {

  this.mensajes = [
    ...data
  ];


  this.cargandoMensajes =
    false;


  this.cdr.detectChanges();


  this.scrollAlFinal();

},


        error: (err) => {

          console.error(
            'Error al cargar mensajes:',
            err
          );


          if (!silencioso) {

            this.error =
              'No se pudieron cargar los mensajes.';

          }


          this.cargandoMensajes =
            false;


          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // ENVIAR MENSAJE
  // ==========================================

  enviarMensaje(): void {

    if (
      !this.conversacionSeleccionada
    ) {

      return;

    }


    const contenido =
      this.nuevoMensaje.trim();


    if (!contenido) {

      return;

    }


    this.enviando = true;

    this.error = '';


    this.chatService
      .enviarMensaje(
        this.conversacionSeleccionada.id,
        contenido
      )
      .subscribe({

        next: (mensaje: any) => {

          this.mensajes.push(
            mensaje
          );


          this.nuevoMensaje = '';


          this.enviando = false;


          this.cargarConversaciones();


          this.cdr.markForCheck();


          this.scrollAlFinal();

        },


        error: (err) => {

          console.error(
            'Error al enviar mensaje:',
            err
          );


          this.error =
            err?.error?.message ||
            'No se pudo enviar el mensaje.';


          this.enviando = false;


          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // REFRESCAR CHAT
  // ==========================================

  refrescarChat(): void {

  if (
    this.conversacionSeleccionada
  ) {

    this.cargarMensajes(
      true
    );

  }

}


  // ==========================================
  // SCROLL AL ÚLTIMO MENSAJE
  // ==========================================

  private scrollAlFinal(): void {

    setTimeout(
      () => {

        const contenedor =
          this.mensajesContenedor
            ?.nativeElement;


        if (contenedor) {

          contenedor.scrollTop =
            contenedor.scrollHeight;

        }

      },
      50
    );

  }

}