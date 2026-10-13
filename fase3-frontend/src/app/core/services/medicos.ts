import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  private apiUrl = 'http://localhost:8080/api/v1/doctors';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  buscarPorEspecialidad(especialidadId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}?especialidadId=${especialidadId}`
    );
  }

  crear(medico: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      medico
    );
  }

  actualizar(id: number, medico: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      medico
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}