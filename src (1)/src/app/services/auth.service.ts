import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sesionActiva = new BehaviorSubject<boolean>(this.estaLogueado());
  estadoSesion$ = this.sesionActiva.asObservable();

  // Verifica si hay token en el localStorage
  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  // Retorna el rol desde el localStorage
  obtenerRol(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?.rol || '';
  }

  // Guarda token y usuario completo en localStorage
  login(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.sesionActiva.next(true);
  }

  // Limpia los datos y emite cierre de sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.sesionActiva.next(false);
  }
}
