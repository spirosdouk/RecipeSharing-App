import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main class="content container mt-3">
      <router-outlet></router-outlet>
    </main>
  `,
  imports: [RouterModule, NavbarComponent]
})
export class AppComponent {
  title = 'Recipes';
}
