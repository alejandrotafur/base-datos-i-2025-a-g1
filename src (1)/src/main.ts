// main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; // Asegúrate de este import

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
