
import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [  // Cambié a export
  { path: '', component: HomeComponent },
  { path: 'registro', component: RegistroComponent }
];
