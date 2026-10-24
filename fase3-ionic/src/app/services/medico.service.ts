import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Medico {
  id: number;

  usuario: {
    id: number;
    email: string;
    nombreCompleto: string;
    rol: string;
  };

  especialidad: {
    id: number;
    nombre: string;
    descripcion: string;
  };

  numeroColegiado: string;

  telefono: string | null;
  centroClinica: string | null;
  direccion: string | null;
  aniosExperiencia: number | null;
  horarioAtencion: string | null;
  biografia: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl =
    'http://localhost:8080/api/v1/doctors';

  constructor(
    private http: HttpClient
  ) {}

  listarMedicos(): Observable<Medico[]> {

    return this.http.get<Medico[]>(
      this.apiUrl
    );
  }

  listarPorEspecialidad(
    especialidadId: number
  ): Observable<Medico[]> {

    return this.http.get<Medico[]>(
      `${this.apiUrl}?especialidadId=${especialidadId}`
    );
  }

  obtenerPorId(
    id: number
  ): Observable<Medico | undefined> {

    return this.listarMedicos().pipe(
      map(medicos =>
        medicos.find(
          medico => medico.id === id
        )
      )
    );
  }
}