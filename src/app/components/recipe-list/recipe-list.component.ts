// src/app/components/recipe-list/recipe-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';

@Component({
  standalone: true,
  selector: 'app-recipe-list',
  template: `
    <div class="row">
      <div class="col-12 col-md-4 mb-3" *ngFor="let recipe of recipes">
        <div class="card h-100 shadow-sm">
          <img
            [src]="recipe.image"
            class="card-img-top fixed-size-image"
            [alt]="recipe.title"
            [title]="recipe.title"
          />
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ recipe.title }}</h5>
            <p class="card-text">
              Ready in {{ recipe.readyInMinutes }} minutes
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <a
                [href]="recipe.sourceUrl"
                class="btn btn-primary"
                target="_blank"
                >View Recipe</a
              >
              <i
                class="fa"
                [ngClass]="{
                  'fa-heart': recipe.saved,
                  'fa-heart-o': !recipe.saved
                }"
                (click)="toggleSave(recipe)"
                title="Save to Favorites"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="!recipes.length">
      <p>No recipes found.</p>
    </div>
  `,
  styles: [
    `
      .fixed-size-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .card {
        transition: transform 0.2s;
      }
      .card:hover {
        transform: scale(1.05);
      }
      .card-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fa-heart,
      .fa-heart-o {
        cursor: pointer;
        font-size: 1.5rem;
        transition: color 0.2s, transform 0.2s;
      }
      .fa-heart {
        color: red;
      }
      .fa-heart:hover,
      .fa-heart-o:hover {
        transform: scale(1.2);
        color: darkred;
      }
    `,
  ],
  imports: [CommonModule],
})
export class RecipeListComponent implements OnInit {
  @Input() recipes: any[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    const savedRecipes = this.recipeService.getSavedRecipes();
    this.recipes.forEach((recipe) => {
      recipe.saved = savedRecipes.some(
        (savedRecipe) => savedRecipe.id === recipe.id
      );
    });
  }

  toggleSave(recipe: any): void {
    if (!recipe.saved) {
      this.recipeService.saveRecipe(recipe);
      recipe.saved = true;
    } else {
      this.recipeService.unsaveRecipe(recipe.id);
      recipe.saved = false;
    }
  }
}
