import { Component, OnInit } from '@angular/core';
import { TarifasService, TarifaVehiculo } from '../services/tarifas.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.less']
})
export class AdminDashboardComponent implements OnInit {
facturacionPorTipoVehiculo: any;
eliminarFactura(arg0: any) {
throw new Error('Method not implemented.');
}
  mostrarVehiculoPersonalizado: boolean = false;

  tarifasPorTiempo: TarifaVehiculo[] = [];

  tipoSeleccionado: string = '';
  placa: string = '';
  horaEntrada: string = '';
  horaSalida: string = '';
  precioCalculado: number | null = null;
  detalleCalculo: string = '';

  registrosTemporales: any[] = [];

  reservasActuales: any[] = [];
  historialReservas: any[] = [];

  nuevaReserva = {
    id: 0,
    placa: '',
    tipo: '',
    tipoPersonalizado: '',
    horaEntrada: '',
    estado: true
  };

  nuevaTarifa: TarifaVehiculo = {
    tipoVehiculo: '',
    diurna: 0,
    nocturna: 0,
    finesSemanaFestivos: 0
  };
facturacionDia: any;
historialFacturacion: any;

  constructor(private tarifasService: TarifasService) {}

  ngOnInit(): void {
    this.obtenerTarifas();
    this.restaurarDesdeStorage();
    this.restaurarRegistrosTemporales();
    this.cargarReservas();
  }

  onTipoVehiculoChange(): void {
    this.mostrarVehiculoPersonalizado = this.nuevaReserva.tipo === 'Personalizado';
  }

  obtenerTarifas(): void {
    this.tarifasPorTiempo = this.tarifasService.getTarifas();
  }

  agregarTarifa(): void {
    if (!this.nuevaTarifa.tipoVehiculo.trim()) {
      alert('El tipo de vehículo no puede estar vacío.');
      return;
    }
    // Evitar duplicados
    const existe = this.tarifasPorTiempo.find(t => t.tipoVehiculo.toLowerCase() === this.nuevaTarifa.tipoVehiculo.trim().toLowerCase());
    if (existe) {
      alert('Ya existe una tarifa para ese tipo de vehículo.');
      return;
    }

    this.tarifasPorTiempo.push({ ...this.nuevaTarifa });
    this.nuevaTarifa = {
      tipoVehiculo: '',
      diurna: 0,
      nocturna: 0,
      finesSemanaFestivos: 0
    };
  }

  eliminarTarifa(tipo: string): void {
    if (confirm(`¿Seguro que quieres eliminar la tarifa para "${tipo}"?`)) {
      this.tarifasPorTiempo = this.tarifasPorTiempo.filter(t => t.tipoVehiculo !== tipo);
    }
  }

  calcularPrecio(): void {
    if (!this.tipoSeleccionado || !this.horaEntrada || !this.horaSalida) {
      alert('Por favor, completa tipo de vehículo, hora de entrada y hora de salida.');
      return;
    }

    const tarifa = this.tarifasPorTiempo.find(t => t.tipoVehiculo === this.tipoSeleccionado);
    if (!tarifa) {
      alert('No existe tarifa registrada para ese tipo de vehículo.');
      return;
    }

    const entrada = new Date(`1970-01-01T${this.horaEntrada}:00`);
    const salida = new Date(`1970-01-01T${this.horaSalida}:00`);

    let diffHoras = (salida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
    if (diffHoras < 0) diffHoras += 24; // manejar cruces de medianoche

    const horasCobro = Math.max(1, Math.ceil(diffHoras));
    const precio = horasCobro * tarifa.diurna;

    this.precioCalculado = precio;
    this.detalleCalculo = `Duración: ${diffHoras.toFixed(2)} horas. Tarifa aplicada: $${tarifa.diurna}/h`;

    const registro = {
      tipo: this.tipoSeleccionado,
      placa: this.placa,
      horaEntrada: this.horaEntrada,
      horaSalida: this.horaSalida,
      precio: precio,
      detalle: this.detalleCalculo,
      timestamp: new Date().toLocaleString()
    };

    this.registrosTemporales.push(registro);
    this.guardarRegistrosTemporales();
  }

  limpiarFormulario(): void {
    this.tipoSeleccionado = '';
    this.placa = '';
    this.horaEntrada = '';
    this.horaSalida = '';
    this.precioCalculado = null;
    this.detalleCalculo = '';
  }

  eliminarRegistroTemporal(index: number): void {
    if (confirm('¿Eliminar este registro temporal?')) {
      this.registrosTemporales.splice(index, 1);
      this.guardarRegistrosTemporales();
    }
  }

  guardarRegistrosTemporales(): void {
    localStorage.setItem('registrosTemporales', JSON.stringify(this.registrosTemporales));
  }

  restaurarRegistrosTemporales(): void {
    const registros = localStorage.getItem('registrosTemporales');
    if (registros) {
      this.registrosTemporales = JSON.parse(registros);
    }
  }

  agregarReservaManual(): void {
    if (!this.nuevaReserva.placa.trim() || !this.nuevaReserva.tipo.trim()) {
      alert('Complete todos los campos para agregar una reserva.');
      return;
    }

    if (this.nuevaReserva.tipo === 'Personalizado') {
      if (!this.nuevaReserva.tipoPersonalizado || this.nuevaReserva.tipoPersonalizado.trim() === '') {
        alert('Por favor ingresa el tipo de vehículo personalizado.');
        return;
      }
      this.nuevaReserva.tipo = this.nuevaReserva.tipoPersonalizado.trim();
    }

    if (!this.nuevaReserva.horaEntrada) {
      alert('Ingrese la hora de entrada.');
      return;
    }

    const nueva = {
      ...this.nuevaReserva,
      id: this.generarIdUnico(),
      estado: true
    };

    this.reservasActuales.push(nueva);
    this.nuevaReserva = { id: 0, placa: '', tipo: '', tipoPersonalizado: '', horaEntrada: '', estado: true };
    this.mostrarVehiculoPersonalizado = false;
  }

  alternarEstado(reserva: any): void {
    reserva.estado = !reserva.estado;
  }

  moverAHistorial(reserva: any): void {
    const salida = prompt('Hora de salida (HH:mm)', '12:00') || '12:00';
    const precioStr = prompt('Precio final') || '0';
    const precio = parseFloat(precioStr);

    if (!salida || isNaN(precio)) {
      alert('Debe ingresar una hora válida y un precio numérico.');
      return;
    }

    const historico = {
      id: reserva.id,
      placa: reserva.placa,
      tipo: reserva.tipo,
      horaEntrada: reserva.horaEntrada,
      horaSalida: salida,
      precio: precio
    };

    this.historialReservas.push(historico);
    this.reservasActuales = this.reservasActuales.filter(r => r.id !== reserva.id);
  }

  eliminarHistorial(id: number): void {
    if (confirm('¿Eliminar este registro del historial?')) {
      this.historialReservas = this.historialReservas.filter(r => r.id !== id);
    }
  }

  cargarReservas(): void {
    // Inicializa arrays o carga de localStorage si implementas persistencia
    this.reservasActuales = [];
    this.historialReservas = [];
  }

  restaurarDesdeStorage(): void {
    // Aquí puedes implementar la carga desde localStorage para reservasActuales e historialReservas si quieres
    // Ejemplo:
    const reservas = localStorage.getItem('reservasActuales');
    if (reservas) this.reservasActuales = JSON.parse(reservas);

    const historial = localStorage.getItem('historialReservas');
    if (historial) this.historialReservas = JSON.parse(historial);
  }

  private generarIdUnico(): number {
    return Math.floor(Math.random() * 1000000);
  }
}
