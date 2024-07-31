import { Component, OnInit } from '@angular/core';
import { RecipeService } from './services/recipe.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main class="content container mt-3">
      <h1>Recipe List</h1>
      <app-search-bar (search)="getRecipes($event)"></app-search-bar>
      <app-recipe-list [recipes]="recipes"></app-recipe-list>
    </main>
  `,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, SearchBarComponent, RecipeListComponent]
})
export class AppComponent implements OnInit {
  title = 'homes';
  recipes: any[] = [];
  query: string = 'pasta'; // Default query, change as needed

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.getRecipes(this.query);
  }

  getRecipes(query: string): void {
    console.log('Fetching recipes for query:', query);
    this.recipeService.getRecipes(query).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        console.log('Recipes fetched:', this.recipes);
      },
      error: (error) => {
        console.error('Error fetching recipes', error);
      }
    });
  }
}
