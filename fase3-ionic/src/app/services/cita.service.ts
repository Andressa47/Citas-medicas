import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CitaResponse {
  id: number;

  pacienteId: number;
  pacienteNombre: string;

  medicoId: number;
  medicoNombre: string;

  especialidadId: number;
  especialidadNombre: string;

  horarioId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;

  estado: string;
  motivo: string;

  diagnostico: string | null;
  receta: string | null;

  fechaCreacion: string;
  fechaActualizacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl =
    'http://localhost:8080/api/v1/appointments';

  constructor(
    private http: HttpClient
  ) {}

  crearCita(
    horarioId: number,
    motivo: string
  ): Observable<CitaResponse> {

    return this.http.post<CitaResponse>(
      this.apiUrl,
      {
        horarioId: horarioId,
        motivo: motivo
      }
    );
  }

  listarMisCitas(): Observable<CitaResponse[]> {

    return this.http.get<CitaResponse[]>(
      `${this.apiUrl}/my-history`
    );
  }

  cancelarCita(
    citaId: number
  ): Observable<CitaResponse> {

    return this.http.put<CitaResponse>(
      `${this.apiUrl}/${citaId}/cancel`,
      {}
    );
  }
}