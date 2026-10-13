import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private apiUrl =
    'http://localhost:8080/api/v1/appointments';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  miHistorial(): Observable<any[]> {

  return this.http.get<any[]>(
    `${this.apiUrl}/my-history`
  );
}

  buscarPorId(id: number): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  listarPorMedico(medicoId: number): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/doctor/${medicoId}`
    );
  }

  listarPorPaciente(pacienteId: number): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/patient/${pacienteId}`
    );
  }

  crear(cita: any): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      cita
    );
  }

  registrarDiagnostico(
    id: number,
    datos: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/diagnosis`,
      datos
    );
  }

  cancelar(id: number): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }
}