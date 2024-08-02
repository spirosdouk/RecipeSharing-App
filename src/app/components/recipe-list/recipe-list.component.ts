import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-recipe-list',
  template: `
    <div class="row">
      <div class="col-12 col-md-3 mb-3" *ngFor="let recipe of recipes">
        <div class="card h-100">
          <img [src]="recipe.image" class="card-img-top fixed-size-image" [alt]="recipe.title" [title]="recipe.title">
          <div class="card-body">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <p class="card-text">Ready in {{ recipe.readyInMinutes }} minutes</p>
            <a [href]="recipe.sourceUrl" class="btn btn-primary" target="_blank">View Recipe</a>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="!recipes.length">
      <p>No recipes found.</p>
    </div>
  `,
  imports: [CommonModule]
})
export class RecipeListComponent {
  @Input() recipes: any[] = [];
}
