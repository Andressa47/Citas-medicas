import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl =
    'http://localhost:8080/api/v1/users';

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // LISTAR TODOS LOS USUARIOS
  // ==========================================

  listarTodos(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );

  }


  // ==========================================
  // BUSCAR USUARIO POR ID
  // ==========================================

  buscarPorId(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // CREAR USUARIO
  // ==========================================

  crear(
    usuario: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      usuario
    );

  }


  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================

  eliminar(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}