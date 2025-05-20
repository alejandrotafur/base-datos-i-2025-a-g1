import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  private apiUrl = 'http://localhost:8081/api/facturacion';  // URL base del backend

  constructor(private http: HttpClient) { }

  // ✅ Crear una nueva factura
  crearFactura(facturacion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, facturacion);
  }

  // ✅ Obtener todas las facturas (opcional para administración o historial)
  obtenerFacturas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`);
  }
}
