import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Componentes
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ForgotPasswordComponent } from './components/recuperar/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { NuestrosServiciosComponent } from './nuestros-servicios/nuestros-servicios.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ReservasComponent } from './reservas/reservas.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component'; // ✅ Nuevo componente

// Rutas
import { APP_ROUTES } from './app.routes';

// Guardas
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    NavbarComponent,
    ForgotPasswordComponent,
    HomeComponent,
    NuestrosServiciosComponent,
    AdminDashboardComponent,
    ReservasComponent,
    FacturacionComponent // ✅ Declaramos Facturación
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
