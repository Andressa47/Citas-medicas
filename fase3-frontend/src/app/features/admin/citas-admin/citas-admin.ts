
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../../core/services/citas';

interface Cita {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  medicoId: number;
  medicoNombre: string;
  especialidadNombre: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: string;
  motivo: string;
}

@Component({
  selector: 'app-citas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-admin.html',
  styleUrl: './citas-admin.css'
})
export class CitasAdmin implements OnInit {

  citas: Cita[] = [];
  cargando = false;
  error = '';

  filtroMedico = 0;
  filtroPaciente = '';
  filtroFecha = '';
  filtroEstado = '';

  constructor(private citasService: CitasService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';

    this.citasService.listarTodas().subscribe({
      next: (respuesta) => {
        this.citas = (respuesta as Cita[]).sort(
          (a, b) =>
            b.fechaHoraInicio.localeCompare(a.fechaHoraInicio)
        );

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al consultar citas:', err);
        this.error =
          'No se pudieron cargar las citas. Comprueba la conexión y los permisos del administrador.';
        this.cargando = false;
      }
    });
  }

  get medicos(): { id: number; nombre: string }[] {
    const mapa = new Map<number, string>();

    this.citas.forEach(cita => {
      mapa.set(cita.medicoId, cita.medicoNombre);
    });

    return Array.from(mapa, ([id, nombre]) => ({
      id,
      nombre
    })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  get citasFiltradas(): Cita[] {
    const paciente = this.filtroPaciente.trim().toLowerCase();

    return this.citas.filter(cita => {
      const coincideMedico =
        !this.filtroMedico ||
        cita.medicoId === this.filtroMedico;

      const coincidePaciente =
        !paciente ||
        cita.pacienteNombre.toLowerCase().includes(paciente);

      const coincideFecha =
        !this.filtroFecha ||
        cita.fechaHoraInicio.slice(0, 10) === this.filtroFecha;

      const coincideEstado =
        !this.filtroEstado ||
        cita.estado === this.filtroEstado;

      return coincideMedico &&
        coincidePaciente &&
        coincideFecha &&
        coincideEstado;
    });
  }

  get pendientes(): number {
    return this.citas.filter(
      cita => cita.estado === 'PENDIENTE'
    ).length;
  }

  get completadas(): number {
    return this.citas.filter(
      cita => cita.estado === 'COMPLETADA'
    ).length;
  }

  get canceladas(): number {
    return this.citas.filter(
      cita => cita.estado === 'CANCELADA'
    ).length;
  }

  limpiarFiltros(): void {
    this.filtroMedico = 0;
    this.filtroPaciente = '';
    this.filtroFecha = '';
    this.filtroEstado = '';
  }
}
