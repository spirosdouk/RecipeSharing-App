import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '../authentication/auth-modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid container">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <a class="navbar-brand" href="#">
            <img src="logo.png" alt="Tastebite" width="150" />
          </a>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/custom-search"
                >Custom Searching</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/my-recipes">My Recipes</a>
            </li>
          </ul>
          <div class="search-bar-container">
            <app-search-bar (search)="onSearch($event)"></app-search-bar>
          </div>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!isLoggedIn">
              <a class="nav-link" href="#" (click)="openAuthDialog($event)"
                >Login</a
              >
            </li>
            <li id="nav-log" class="nav-item dropdown" *ngIf="isLoggedIn">
              <a
                class="nav-link"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                (click)="toggleDropdown()"
              >
                <img
                  src="user.png"
                  alt="User"
                  class="rounded-circle"
                  width="50"
                />
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
                [ngClass]="{ show: dropdownOpen }"
              >
                <li>
                  <a class="dropdown-item" href="#" (click)="logout()"
                    >Logout</a
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  imports: [RouterModule, CommonModule, SearchBarComponent],
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() search = new EventEmitter<{
    query: string;
    cuisine: string;
    intolerances: string[];
  }>();

  isLoggedIn = false;
  dropdownOpen = false;

  constructor(
    private searchService: SearchService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  onSearch(searchParams: {
    query: string;
    cuisine: string;
    intolerances: string[];
  }) {
    this.searchService.emitSearchEvent(searchParams);
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
  }

  openAuthDialog(event: Event): void {
    event.preventDefault();
    this.dialog.open(AuthModalComponent, {
      width: '400px',
    });
  }
}
