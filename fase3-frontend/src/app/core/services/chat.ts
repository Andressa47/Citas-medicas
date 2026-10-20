import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl =
    'http://localhost:8080/api/v1/chat';

  constructor(
    private http: HttpClient
  ) {}


  listarConversaciones(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/conversations`
    );
  }


  crearConversacion(
    datos: {
      pacienteId?: number;
      medicoId?: number;
    }
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/conversations`,
      datos
    );
  }


  listarMensajes(
    conversacionId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/conversations/${conversacionId}/messages`
    );
  }


  enviarMensaje(
    conversacionId: number,
    contenido: string
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/conversations/${conversacionId}/messages`,
      {
        contenido
      }
    );
  }
}