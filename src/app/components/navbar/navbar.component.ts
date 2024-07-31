import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <!-- <img src="assets/logo.svg" alt="logo" width="100" height="30" class="d-inline-block align-text-top"> -->
        </a>
        <a class="nav-link" routerLink="/add-location">See your favourites</a>
      </div>
    </nav>
  `,
  imports: [RouterModule]
})
export class NavbarComponent {}
