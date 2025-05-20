import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TarifaVehiculo {
  tipoVehiculo: string;
  diurna: number;
  nocturna: number;
  finesSemanaFestivos: number;
}

@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  eliminarFactura(arg0: any) {
    throw new Error('Method not implemented.');
  }
  guardarFactura(factura: any) {
    throw new Error('Method not implemented.');
  }
  private readonly STORAGE_KEY = 'tarifasPorTiempo';

  constructor(private http: HttpClient) {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.setDefaultTarifas(); // Inicializar si no hay datos
    }
  }

  // Establece tarifas por defecto si el almacenamiento está vacío
  private setDefaultTarifas(): void {
    const tarifasIniciales: TarifaVehiculo[] = [
      { tipoVehiculo: 'Carro', diurna: 3000, nocturna: 3500, finesSemanaFestivos: 4000 },
      { tipoVehiculo: 'Moto', diurna: 1500, nocturna: 1800, finesSemanaFestivos: 2000 },
      { tipoVehiculo: 'Bicicleta', diurna: 500, nocturna: 600, finesSemanaFestivos: 700 }
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tarifasIniciales));
  }

  // Obtiene todas las tarifas del almacenamiento local
  getTarifas(): TarifaVehiculo[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Guarda las tarifas actualizadas en el almacenamiento local
  guardarTarifas(tarifas: TarifaVehiculo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tarifas));
  }

  // Agrega una nueva tarifa, validando que no exista un duplicado
  agregarTarifa(tarifa: TarifaVehiculo): string {
    const tarifas = this.getTarifas();
    const existe = tarifas.some(t => t.tipoVehiculo.toLowerCase() === tarifa.tipoVehiculo.toLowerCase());
    if (existe) {
      return `La tarifa para el tipo de vehículo '${tarifa.tipoVehiculo}' ya existe.`;
    }
    tarifas.push(tarifa);
    this.guardarTarifas(tarifas);
    return 'Tarifa agregada exitosamente.';
  }

  // Elimina una tarifa por el tipo de vehículo
  eliminarTarifa(tipoVehiculo: string): string {
    const tarifas = this.getTarifas();
    const index = tarifas.findIndex(t => t.tipoVehiculo.toLowerCase() === tipoVehiculo.toLowerCase());
    if (index === -1) {
      return `No se encontró una tarifa para el tipo de vehículo '${tipoVehiculo}'.`;
    }
    tarifas.splice(index, 1);
    this.guardarTarifas(tarifas);
    return `Tarifa para el vehículo '${tipoVehiculo}' eliminada exitosamente.`;
  }

  // Actualiza una tarifa existente
  actualizarTarifa(tarifaActualizada: TarifaVehiculo): string {
    const tarifas = this.getTarifas();
    const index = tarifas.findIndex(t => t.tipoVehiculo.toLowerCase() === tarifaActualizada.tipoVehiculo.toLowerCase());
    if (index === -1) {
      return `No se encontró una tarifa para el tipo de vehículo '${tarifaActualizada.tipoVehiculo}'.`;
    }
    tarifas[index] = tarifaActualizada;
    this.guardarTarifas(tarifas);
    return `Tarifa para el vehículo '${tarifaActualizada.tipoVehiculo}' actualizada exitosamente.`;
  }

  // Busca una tarifa específica por tipo de vehículo
  buscarTarifa(tipoVehiculo: string): TarifaVehiculo | null {
    const tarifas = this.getTarifas();
    return tarifas.find(t => t.tipoVehiculo.toLowerCase() === tipoVehiculo.toLowerCase()) || null;
  }

  // Obtener las reservas desde el backend (simulado)
  getReservas(): Observable<any[]> {
    return this.http.get<any[]>('URL_DEL_ENDPOINT_DE_RESERVAS');
  }

  // Obtener la facturación desde el backend (simulado)
  getFacturacion(): Observable<any[]> {
    return this.http.get<any[]>('URL_DEL_ENDPOINT_DE_FACTURACION');
  }
}
