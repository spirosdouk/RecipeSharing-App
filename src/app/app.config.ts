import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: AppComponent }
    ]),
    provideHttpClient(),
  ]
};
