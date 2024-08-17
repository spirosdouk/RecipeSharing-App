import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-ingredient-input',
  template: `
    <div class="ingredient-input">
      <h3>Enter Main Ingredients</h3>
      <div class="form-group">
        <input
          [(ngModel)]="ingredient1"
          placeholder="Ingredient 1"
          class="form-control mb-2"
        />
        <input
          [(ngModel)]="ingredient2"
          placeholder="Ingredient 2"
          class="form-control mb-2"
        />
        <input
          [(ngModel)]="ingredient3"
          placeholder="Ingredient 3"
          class="form-control mb-2"
        />
      </div>
      <button (click)="onSearch()" class="btn btn-primary">
        Search Recipes
      </button>
    </div>
  `,
  imports: [CommonModule, FormsModule],
})
export class IngredientInputComponent {
  ingredient1: string = '';
  ingredient2: string = '';
  ingredient3: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    const ingredients = [this.ingredient1, this.ingredient2, this.ingredient3]
      .filter((ingredient) => ingredient.trim() !== '')
      .join(',');
    this.search.emit(ingredients);
  }
}
