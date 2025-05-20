import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarService {

  private apiUrl = 'http://localhost:8081/api/usuarios'; // Asegúrate que el puerto coincida con el de tu backend

  constructor(private http: HttpClient) {}

  enviarCorreo(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar-codigo`, { correo });
  }
}
