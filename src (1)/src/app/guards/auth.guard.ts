import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    // 👉 Permitir acceso libre a ciertas rutas públicas
    const publicRoutes = ['/servicios']; // Agrega aquí las rutas que no necesitan autenticación
    if (publicRoutes.includes(state.url)) {
      return true;
    }

    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
