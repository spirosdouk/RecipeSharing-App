import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { SearchService } from '../../services/search.service';
import { IngredientInputComponent } from '../ingredient-input-component/ingredient-input.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-custom-search',
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-3">
      <h1>Custom Search</h1>
      <app-ingredient-input (search)="onIngredientSearch($event)"></app-ingredient-input>
      <ng-container *ngIf="recipes$ | async as recipes; else noRecipes">
        <app-recipe-list [recipes]="recipes"></app-recipe-list>
      </ng-container>
      <ng-template #noRecipes>
        <p>No recipes found.</p>
      </ng-template>
      <div *ngIf="error$ | async as errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </div>
  `,
  imports: [CommonModule, FormsModule, IngredientInputComponent, RecipeListComponent, NavbarComponent],
})
export class CustomSearchComponent {
  recipes$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private recipeService: RecipeService, private searchService: SearchService) {
    this.recipes$ = this.recipeService.recipes$;
    this.loading$ = this.recipeService.loading$;
    this.error$ = this.recipeService.error$;
  }

  onIngredientSearch(ingredients: string): void {
    this.recipeService.getRecipesByIngredients(ingredients);
  }
}
