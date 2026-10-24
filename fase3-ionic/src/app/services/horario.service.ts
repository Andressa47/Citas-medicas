import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HorarioDisponible {
  id: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  disponible: boolean;

  medico: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private apiUrl =
    'http://localhost:8080/api/v1/schedules';

  constructor(
    private http: HttpClient
  ) {}

  listarDisponiblesPorMedico(
    medicoId: number
  ): Observable<HorarioDisponible[]> {

    return this.http.get<HorarioDisponible[]>(
      `${this.apiUrl}/available?medicoId=${medicoId}`
    );
  }
}