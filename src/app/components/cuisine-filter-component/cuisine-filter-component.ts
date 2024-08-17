import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-cuisine-filter',
  template: `
    <div class="cuisine-filter">
      <label for="cuisine">Cuisine:</label>
      <select
        id="cuisine"
        [(ngModel)]="selectedCuisine"
        (change)="onCuisineChange($event)"
        class="form-control"
      >
        <option value="">All</option>
        <option *ngFor="let cuisine of cuisines" [value]="cuisine">
          {{ cuisine }}
        </option>
      </select>
    </div>
  `,
  imports: [CommonModule, FormsModule],
})
export class CuisineFilterComponent {
  @Output() cuisineChange = new EventEmitter<string>();

  cuisines: string[] = [
    'African',
    'Asian',
    'American',
    'British',
    'Cajun',
    'Caribbean',
    'Chinese',
    'Eastern European',
    'European',
    'French',
    'German',
    'Greek',
    'Indian',
    'Irish',
    'Italian',
    'Japanese',
    'Jewish',
    'Korean',
    'Latin American',
    'Mediterranean',
    'Mexican',
    'Middle Eastern',
    'Nordic',
    'Southern',
    'Spanish',
    'Thai',
    'Vietnamese',
  ];

  selectedCuisine: string = '';

  onCuisineChange(event: Event): void {
    this.cuisineChange.emit(this.selectedCuisine);
  }
}
