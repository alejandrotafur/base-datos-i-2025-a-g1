import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.less']
})
export class ReservasComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  reserva = {
    tipoVehiculo: '',
    vehiculoPersonalizado: '',
    placa: '',
    horaEntrada: '',
    horaSalida: ''
  };

  ultimaReserva: any = null;
  tipoReserva: string = '';
  mostrarEspacios: boolean = false;

  espacioReservado: { tipo: string, disponible: boolean } | null = null;
  numeroEspacio: number = 0;

  reservarEspacio() {
    const { tipoVehiculo, vehiculoPersonalizado, placa, horaEntrada, horaSalida } = this.reserva;

    if ((tipoVehiculo && vehiculoPersonalizado) || (!tipoVehiculo && !vehiculoPersonalizado) || !placa) {
      alert('Debes llenar los campos correctamente para un solo tipo de reserva.');
      return;
    }

    if (!horaEntrada || !horaSalida) {
      alert('Debes seleccionar la hora de entrada y salida.');
      return;
    }

    // Simulamos un ID de usuario (luego se debe reemplazar por el real del login)
    const usuarioId = 1;

    this.http.post(`http://localhost:8081/api/reservas/crear/${usuarioId}`, this.reserva).subscribe({
      next: (response: any) => {
        alert('Reserva registrada correctamente');

        this.ultimaReserva = { ...this.reserva };
        this.tipoReserva = tipoVehiculo ? 'tipo' : 'personalizada';
        this.mostrarEspacios = true;

        const tipo = (tipoVehiculo || vehiculoPersonalizado).toLowerCase();
        const disponibilidadAleatoria = Math.random() < 0.5;

        this.espacioReservado = {
          tipo,
          disponible: disponibilidadAleatoria
        };

        this.numeroEspacio = Math.floor(Math.random() * 100) + 1;

        // Limpiar formulario
        this.reserva = {
          tipoVehiculo: '',
          vehiculoPersonalizado: '',
          placa: '',
          horaEntrada: '',
          horaSalida: ''
        };
      },
      error: (err) => {
        console.error('Error al crear reserva', err);
        alert('Error al registrar la reserva');
      }
    });
  }

  // Duración estimada
  get duracionReserva(): string {
    if (!this.ultimaReserva?.horaEntrada || !this.ultimaReserva?.horaSalida) return '';
    const entrada = new Date(this.ultimaReserva.horaEntrada);
    const salida = new Date(this.ultimaReserva.horaSalida);
    const diffMs = salida.getTime() - entrada.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMin = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${diffHrs}h ${diffMin}min`;
  }

  // Costo estimado
  get costoEstimado(): number {
    if (!this.ultimaReserva?.horaEntrada || !this.ultimaReserva?.horaSalida) return 0;
    const entrada = new Date(this.ultimaReserva.horaEntrada);
    const salida = new Date(this.ultimaReserva.horaSalida);
    const diffHoras = Math.ceil((salida.getTime() - entrada.getTime()) / (1000 * 60 * 60));
    const tarifaPorHora = 3000;
    return diffHoras * tarifaPorHora;
  }

  // Formato de fecha legible
  formatFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
