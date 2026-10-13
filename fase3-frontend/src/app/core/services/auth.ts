import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Quítale el "/login" al final de esta línea
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(credenciales: any): Observable<any> {
    // Así esta línea ya construirá la ruta correctamente
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  guardarToken(token: string, rol: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
  }

  obtenerRol() {
    return localStorage.getItem('rol');
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}