import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mensaje {
  id: number;
  citaId: number;
  remitenteId: number;
  remitenteNombre: string;
  contenido: string;
  fechaHora: string;
  leido: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl =
    'http://localhost:8080/api/v1/appointments';

  constructor(
    private http: HttpClient
  ) {}

  listarMensajes(
    citaId: number
  ): Observable<Mensaje[]> {

    return this.http.get<Mensaje[]>(
      `${this.apiUrl}/${citaId}/messages`
    );
  }

  enviarMensaje(
    citaId: number,
    contenido: string
  ): Observable<Mensaje> {

    return this.http.post<Mensaje>(
      `${this.apiUrl}/${citaId}/messages`,
      {
        contenido: contenido
      }
    );
  }

  contarMensajesNoLeidos(
    citaId: number
  ): Observable<number> {

    return this.http.get<number>(
      `${this.apiUrl}/${citaId}/messages/unread-count`
    );
  }
}