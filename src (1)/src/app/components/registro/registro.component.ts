import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.less']
})
export class RegistroComponent {
  usuarios: Usuario[] = [];
  editando = false;
  indexEdit: number | null = null;
  usuario: Usuario = this.getUsuarioVacio();

  correoInvalido = false;
  telefonoInvalido = false;
  mostrarContrasena: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  guardarUsuario(): void {
    // Validación de campos obligatorios
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.contrasena || !this.usuario.telefono || !this.usuario.rol) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    // Validación de correo y teléfono
    this.correoInvalido = !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(this.usuario.correo);
    this.telefonoInvalido = !/^\d{10}$/.test(this.usuario.telefono);

    if (this.correoInvalido || this.telefonoInvalido) {
      alert('Corrige los errores antes de continuar.');
      return;
    }

    if (this.editando && this.indexEdit !== null) {
      // Actualización local (sin enviar al backend)
      this.usuarios[this.indexEdit] = { ...this.usuario };
      alert('Usuario actualizado correctamente.');
      this.resetFormulario();
    } else {
      // Envío al backend
      this.usuarioService.registrarUsuario(this.usuario).subscribe({
        next: () => {
          alert('Usuario registrado correctamente.');
          this.usuarios.push({ ...this.usuario });
          this.resetFormulario();
        },
        error: (err) => {
          console.error('Error al registrar usuario:', err);
          alert('Ocurrió un error al guardar en el servidor.');
        }
      });
    }
  }

  editarUsuario(index: number): void {
    this.usuario = { ...this.usuarios[index] };
    this.editando = true;
    this.indexEdit = index;
    this.mostrarContrasena = false;
  }

  eliminarUsuario(index: number): void {
    const confirmacion = confirm('¿Estás seguro de eliminar este usuario?');
    if (!confirmacion) return;

    this.usuarios.splice(index, 1);
    if (this.editando && this.indexEdit === index) {
      this.resetFormulario();
    }
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  resetFormulario(): void {
    this.usuario = this.getUsuarioVacio();
    this.editando = false;
    this.indexEdit = null;
    this.correoInvalido = false;
    this.telefonoInvalido = false;
    this.mostrarContrasena = false;
  }

  private getUsuarioVacio(): Usuario {
    return {
      nombre: '',
      correo: '',
      contrasena: '',
      telefono: '',
      rol: ''
    };
  }
}
