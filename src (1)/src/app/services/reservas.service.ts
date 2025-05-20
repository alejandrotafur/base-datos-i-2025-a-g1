import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  tipoVehiculo: string;
  vehiculoPersonalizado: string;
  placa: string;
  horaEntrada: string;
  horaSalida: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private baseUrl = 'http://localhost:8081/api/reservas';

  constructor(private http: HttpClient) {}

  crearReserva(usuarioId: number, reserva: Reserva): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear/${usuarioId}`, reserva);
  }

  // Otros métodos futuros
  // obtenerReservasPorUsuario(usuarioId: number): Observable<Reserva[]> { ... }
  // cancelarReserva(id: number): Observable<any> { ... }
}
