import { Component } from '@angular/core';
import { RecuperarService } from '../../services/recuperar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent {
  correo: string = '';
  mensaje: string = '';
  error: boolean = false;
  cargando: boolean = false;

  constructor(private recuperarService: RecuperarService) {}

  enviarCodigo(): void {
    // Evitar múltiples envíos
    if (this.cargando) return;

    this.resetMensajes();

    if (!this.esCorreoValido(this.correo)) {
      this.error = true;
      this.mensaje = 'Por favor ingresa un correo válido.';
      return;
    }

    this.cargando = true;

    this.recuperarService.enviarCorreo(this.correo).subscribe({
      next: () => {
        this.cargando = false;
        this.error = false;
        this.mensaje = 'Código enviado correctamente. Revisa tu correo.';
        // Limpiar mensaje luego de 5 segundos
        setTimeout(() => this.mensaje = '', 5000);
      },
      error: (err) => {
        this.cargando = false;
        this.error = true;
        this.mensaje = err.error?.message || 'Error al enviar el código.';
        console.error('Error al enviar código:', err);
      }
    });
  }

  private resetMensajes(): void {
    this.mensaje = '';
    this.error = false;
  }

  private esCorreoValido(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }
}
