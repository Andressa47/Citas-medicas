import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl =
    'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  buscarPorId(id: number): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  crear(usuario: any): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      usuario
    );
  }

  eliminar(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}