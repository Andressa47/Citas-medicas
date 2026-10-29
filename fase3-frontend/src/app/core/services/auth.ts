import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://localhost:8080/api/v1/auth';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // LOGIN
  // ==========================================

  login(
    credenciales: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/login`,
      credenciales
    );

  }


  // ==========================================
  // CAMBIO OBLIGATORIO
  // ==========================================

  cambiarPasswordObligatoria(
    datos: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/change-required-password`,
      datos
    );

  }


  // ==========================================
  // CAMBIO VOLUNTARIO
  // ==========================================

  cambiarPassword(
    datos: {
      passwordActual: string;
      nuevaPassword: string;
      confirmarPassword: string;
    }
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/change-password`,
      datos
    );

  }


  // ==========================================
  // TOKEN
  // ==========================================

  guardarToken(
    token: string,
    rol: string
  ): void {

    localStorage.setItem(
      'token',
      token
    );

    localStorage.setItem(
      'rol',
      rol
    );

  }


  obtenerRol(): string | null {

    return localStorage.getItem(
      'rol'
    );

  }


  estaAutenticado(): boolean {

    return !!localStorage.getItem(
      'token'
    );

  }


  cerrarSesion(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'rol'
    );

  }

}