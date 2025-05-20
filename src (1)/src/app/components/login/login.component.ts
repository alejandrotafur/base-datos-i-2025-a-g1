import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  credentials = {
    correo: '',
    contrasena: ''
  };

  mostrarContrasena = false;
  correoInvalido = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  iniciarSesion(): void {
    const esGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(this.credentials.correo);
    this.correoInvalido = !esGmail;

    if (!esGmail) {
      alert('Solo se permiten correos @gmail.com');
      return;
    }

    this.usuarioService.login(this.credentials).subscribe({
      next: (res: any) => {
        console.log("Inicio de sesión exitoso:", res);

        // Asegúrate que el backend envía el token y un objeto de usuario con rol
        this.authService.login(res.token, { rol: res.rol }); 

        alert("Inicio de sesión exitoso");

        // Redirige según el rol
        if (res.rol === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error("Error de inicio de sesión:", err);
        alert("Credenciales inválidas");
      }
    });
  }
}
