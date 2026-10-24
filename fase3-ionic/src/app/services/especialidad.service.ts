import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl =
    'http://localhost:8080/api/v1/specialties';

  constructor(
    private http: HttpClient
  ) {}

  listarEspecialidades(): Observable<Especialidad[]> {

    return this.http.get<Especialidad[]>(
      this.apiUrl
    );
  }
}