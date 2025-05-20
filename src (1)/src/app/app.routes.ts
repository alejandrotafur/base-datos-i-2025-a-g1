import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/recuperar/forgot-password.component';
import { NuestrosServiciosComponent } from './nuestros-servicios/nuestros-servicios.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ReservasComponent } from './reservas/reservas.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component'; // ✅ Importamos Facturación

import { AuthGuard } from './guards/auth.guard'; // Asegúrate de que esté bien configurado

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: ForgotPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'servicios', component: NuestrosServiciosComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'reservas', component: ReservasComponent, canActivate: [AuthGuard] },
  { path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard] }, // ✅ Nueva ruta protegida
  { path: '**', redirectTo: 'login' }
];
