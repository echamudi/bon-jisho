import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BonIpcRenderer } from 'App/modules/shared/services/electron.service.types';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Get OS as body class
((window as any).electron.ipcRenderer as BonIpcRenderer).invoke('get-platform').then((platform) => {
  window.document.body.classList.add(platform);
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

