import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilMedicoService {

  private apiUrl =
    'http://localhost:8080/api/v1/doctor-profile';


  constructor(
    private http: HttpClient
  ) {}


  obtenerMiPerfil(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/me`
    );

  }


  actualizarMiPerfil(
    datos: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/me`,
      datos
    );

  }
}