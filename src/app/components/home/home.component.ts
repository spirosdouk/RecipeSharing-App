import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-navbar></app-navbar>

    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to Recipe Hub</h1>
        <p>Your one-stop destination for delicious recipes.</p>
      </div>
    </section>

    <section class="featured-recipes">
      <div class="container">
        <h2>Featured Recipes</h2>
        <app-recipe-list [recipes]="featuredRecipes"></app-recipe-list>
      </div>
    </section>

    <section class="categories">
      <div class="container">
        <h2>Popular Categories</h2>
        <div class="category-buttons">
          <button>Breakfast</button>
          <button>Lunch</button>
          <button>Dinner</button>
          <button>Desserts</button>
        </div>
      </div>
    </section>

    <section class="call-to-action">
      <div class="container">
        <h2>Create Your Custom Recipe</h2>
        <a routerLink="/custom-search" class="btn btn-primary">Get Started</a>
      </div>
    </section>

    <footer>
      <div class="container footer-content">
        <nav>
          <a routerLink="/privacy">Privacy Policy</a>
          <a routerLink="/terms">Terms of Service</a>
        </nav>
        <div class="social-media">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatDialogModule,
    SearchBarComponent,
    RecipeListComponent,
    NavbarComponent
  ]
})
export class HomeComponent {
  featuredRecipes = []; // Populate with data from your service
}
