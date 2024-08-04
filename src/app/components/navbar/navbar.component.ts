import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchService } from '../../services/search.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <a class="navbar-brand" href="#">
            <img src="logo.png" alt="Tastebite" width="150">
          </a>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/custom-search">Custom Searching</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">My Recipes</a>
            </li>
          </ul>
          <div class="search-bar-container">
            <app-search-bar (search)="onSearch($event)"></app-search-bar>
          </div>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#">
              <img src="user.png" alt="User" class="rounded-circle" width="50">
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  imports: [RouterModule, SearchBarComponent],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() search = new EventEmitter<{ query: string, cuisine: string, intolerances: string[] }>();

  constructor(private searchService: SearchService) {}

  onSearch(searchParams: { query: string, cuisine: string, intolerances: string[] }) {
    this.searchService.emitSearchEvent(searchParams);
  }
}
