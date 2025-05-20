
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8081/api/auth'; // Base URL del backend

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario); // Registro de usuario
  }

  login(credentials: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials); // Inicio de sesión
  }

  recuperarContrasena(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, { correo }); // Recuperación de contraseña
  }
}
