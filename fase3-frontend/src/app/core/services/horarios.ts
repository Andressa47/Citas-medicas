import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private apiUrl =
    'http://localhost:8080/api/v1/schedules';

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
}