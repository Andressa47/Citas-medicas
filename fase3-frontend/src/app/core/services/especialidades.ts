import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Especialidad {
  id?: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  private apiUrl = 'http://localhost:8080/api/v1/specialties';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(
      `${this.apiUrl}/${id}`
    );
  }

  crear(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(
      this.apiUrl,
      especialidad
    );
  }

  actualizar(
    id: number,
    especialidad: Especialidad
  ): Observable<Especialidad> {

    return this.http.put<Especialidad>(
      `${this.apiUrl}/${id}`,
      especialidad
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}