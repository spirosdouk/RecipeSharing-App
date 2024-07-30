import { Component, OnInit } from '@angular/core';
import { RecipeService } from './recipe.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <!-- <img src="assets/logo.svg" alt="logo" width="100" height="30" class="d-inline-block align-text-top"> -->
        </a>
        <a class="nav-link" routerLink="/add-location">Add Location</a>
      </div>
    </nav>
    <main class="content container mt-3">
      <h1>Recipe List</h1>
      <input [(ngModel)]="query" placeholder="Search recipes">
      <button (click)="getRecipes()">Search</button>

      <div *ngIf="recipes.length">
        <div *ngFor="let recipe of recipes">
          <h2>{{ recipe.title }}</h2>
          <img [src]="recipe.image" alt="{{ recipe.title }}">
          <p>Ready in {{ recipe.readyInMinutes }} minutes</p>
        </div>
      </div>
      <div *ngIf="!recipes.length">
        <p>No recipes found.</p>
      </div>
    </main>
    <router-outlet></router-outlet>
  `,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AppComponent implements OnInit {
  title = 'homes';
  recipes: any[] = [];
  query: string = 'pasta'; // Default query, change as needed

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  async getRecipes(): Promise<void> {
    console.log('Fetching recipes for query:', this.query);
    try {
      const data = await this.recipeService.getRecipes(this.query);
      console.log('Recipes fetched:', data.results);
      this.recipes = data.results.map((recipe: any) => {
        // Ensure the image URL is complete
        return {
          ...recipe,
          image: `https://spoonacular.com/recipeImages/${recipe.image}`
        };
      });
    } catch (error) {
      console.error('Error fetching recipes', error);
    }
  }
}
