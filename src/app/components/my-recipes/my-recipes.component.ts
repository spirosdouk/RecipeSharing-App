import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-my-recipes',
  template: `
    <app-navbar></app-navbar>
    <div class="container bg-overlay">
      <div class="text-center mb-5">
        <h2 class="display-4">My Saved Recipes</h2>
        <p class="lead">Here are the recipes you've saved. Enjoy your favorite dishes!</p>
      </div>
      <app-recipe-list [recipes]="savedRecipes"></app-recipe-list>
    </div>
  `,
  styles: [`
    .bg-overlay {
      padding: 30px;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .text-center {
      text-align: center;
    }
    .display-4 {
      font-weight: 300;
    }
    .lead {
      font-size: 1.25rem;
      font-weight: 300;
    }
  `],
  imports: [CommonModule, RecipeListComponent, NavbarComponent]
})
export class MyRecipesComponent implements OnInit {
  savedRecipes: any[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.savedRecipes = this.recipeService.getSavedRecipes();
  }
}
