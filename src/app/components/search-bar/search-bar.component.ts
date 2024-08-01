import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CuisineFilterComponent } from '../cuisine-filter-component/cuisine-filter-component';
import { IntoleranceFilterComponent } from '../intolerance-filter/intolerance-filter.component';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  template: `
    <div class="input-group search-bar mb-3">
      <input [(ngModel)]="query" type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon">
      <button (click)="onSearch()" class="input-group-text border-0" id="search-addon">
        <i class="fas fa-search"></i>
      </button>
    </div>
    <app-cuisine-filter (cuisineChange)="onCuisineChange($event)"></app-cuisine-filter>
    <app-intolerance-filter (intolerancesChange)="onIntolerancesChange($event)"></app-intolerance-filter>
  `,
  imports: [CommonModule, FormsModule, CuisineFilterComponent, IntoleranceFilterComponent],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  query: string = '';
  selectedCuisine: string = '';
  selectedIntolerances: string[] = [];
  @Output() search = new EventEmitter<{ query: string, cuisine: string, intolerances: string[] }>();
  @Output() cuisineChange = new EventEmitter<string>();
  @Output() intolerancesChange = new EventEmitter<string[]>();

  onSearch(): void {
    this.search.emit({ query: this.query, cuisine: this.selectedCuisine, intolerances: this.selectedIntolerances });
  }

  onCuisineChange(cuisine: string): void {
    this.selectedCuisine = cuisine;
    this.cuisineChange.emit(cuisine);
  }

  onIntolerancesChange(intolerances: string[]): void {
    this.selectedIntolerances = intolerances;
    this.intolerancesChange.emit(intolerances);
  }
}
