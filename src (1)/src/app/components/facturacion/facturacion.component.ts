import { Component } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';


@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.less']
})
export class FacturacionComponent {
  nombreCliente = '';
  placaVehiculo = '';
  horasEstadia: number = 0;
  tipoVehiculo = '';
  vehiculoPersonalizado = '';
  total = 0;

  tarifasPorHora: { [tipo: string]: number } = {
    'Carro': 3000,
    'Moto': 1500,
    'Bicicleta': 500,
    'Camioneta': 4000,
    'Bus': 5000
  };

  facturas: {
    cliente: string;
    placa: string;
    horas: number;
    tipo: string;
    total: number;
    fecha: string;
  }[] = [];

  Object = Object;

  constructor(private facturacionService: FacturacionService) {}

  calcularTotal() {
    const tipoUsado = this.tipoVehiculo || this.vehiculoPersonalizado;
    const tarifa = this.tarifasPorHora[this.tipoVehiculo] || 2000;
    this.total = this.horasEstadia * tarifa;
  }

  generarFactura() {
    this.calcularTotal();

    const tipoUsado = this.tipoVehiculo || this.vehiculoPersonalizado || 'Desconocido';

    const nuevaFactura = {
      cliente: this.nombreCliente,
      placa: this.placaVehiculo,
      horas: this.horasEstadia,
      tipo: tipoUsado,
      total: this.total,
      fecha: new Date().toISOString().split('T')[0]
    };

    // Mostrar en la tabla del frontend
    this.facturas.push(nuevaFactura);

    // Enviar al backend
    this.facturacionService.crearFactura(nuevaFactura).subscribe({
      next: (resp) => {
        console.log('Factura registrada en el backend:', resp);
        alert(`Factura registrada para ${this.nombreCliente}`);
      },
      error: (err) => {
        console.error('Error al registrar factura en backend:', err);
        alert('Ocurrió un error al registrar la factura');
      }
    });

    // Limpiar formulario
    this.nombreCliente = '';
    this.placaVehiculo = '';
    this.horasEstadia = 0;
    this.tipoVehiculo = '';
    this.vehiculoPersonalizado = '';
    this.total = 0;
  }
}
