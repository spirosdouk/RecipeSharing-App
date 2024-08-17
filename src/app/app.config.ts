import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { CustomSearchComponent } from './components/custom-search-component/custom-search.component';
import { MyRecipesComponent } from './components/my-recipes/my-recipes.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent, title: 'Home Page' },
      {
        path: 'custom-search',
        component: CustomSearchComponent,
        title: 'Custom Search Page',
      },
      {
        path: 'my-recipes',
        component: MyRecipesComponent,
        title: 'My Recipes',
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
    provideHttpClient(),
  ],
};
