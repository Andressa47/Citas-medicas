import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioPerfil {
  id: number;
  email: string;
  nombreCompleto: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl =
    'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  obtenerMiPerfil(): Observable<UsuarioPerfil> {
    return this.http.get<UsuarioPerfil>(
      `${this.apiUrl}/me`
    );
  }
}