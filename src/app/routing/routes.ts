import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { CustomSearchComponent } from '../components/custom-search-component/custom-search.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home Page' },
  { path: 'custom-search', component: CustomSearchComponent, title: 'Custom Search Page' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
