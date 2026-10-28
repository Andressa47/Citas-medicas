import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type DiaSemana =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface BloqueHorarioSemanal {
  id?: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface ConfiguracionHorario {
  medicoId: number;
  medicoNombre: string;
  duracionConsultaMinutos: number;
  bloques: BloqueHorarioSemanal[];
  horariosGenerados: number;
}

export interface ConfiguracionHorarioRequest {
  duracionConsultaMinutos: number;
  bloques: BloqueHorarioSemanal[];
}

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private apiUrl =
    'http://localhost:8080/api/v1/schedules';

  private configUrl =
    'http://localhost:8080/api/v1/schedule-config';

  constructor(private http: HttpClient) {}

  listarDisponibles(
    medicoId: number,
    fecha?: string
  ): Observable<any[]> {

    let url =
      `${this.apiUrl}/available?medicoId=${medicoId}`;

    if (fecha) {
      url += `&fecha=${fecha}`;
    }

    return this.http.get<any[]>(url);
  }

  crear(horario: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      horario
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  obtenerConfiguracion(
    medicoId: number
  ): Observable<ConfiguracionHorario> {

    return this.http.get<ConfiguracionHorario>(
      `${this.configUrl}/${medicoId}`
    );
  }

  guardarConfiguracion(
    medicoId: number,
    request: ConfiguracionHorarioRequest
  ): Observable<ConfiguracionHorario> {

    return this.http.put<ConfiguracionHorario>(
      `${this.configUrl}/${medicoId}`,
      request
    );
  }
}
