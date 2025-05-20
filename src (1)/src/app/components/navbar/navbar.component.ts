import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  rol: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verifica si el usuario está logueado y asigna el rol desde el localStorage o el AuthService
    this.isLoggedIn = this.authService.estaLogueado();
    this.rol = this.authService.obtenerRol();

    // Suscripción a cambios de sesión para actualización dinámica
    this.authService.estadoSesion$.subscribe((estado) => {
      this.isLoggedIn = estado;
      this.rol = this.authService.obtenerRol();
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.rol = '';
    this.router.navigate(['/login']);
  }
}
