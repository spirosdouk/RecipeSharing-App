import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { CustomSearchComponent } from './components/custom-search-component/custom-search.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent, title: 'Home Page' },
      { path: 'custom-search', component: CustomSearchComponent, title: 'Custom Search Page' },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]),
    provideHttpClient(),
  ]
};
