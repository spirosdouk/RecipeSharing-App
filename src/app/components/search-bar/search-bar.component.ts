import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  template: `
    <div class="form-inline mb-3">
      <input [(ngModel)]="query" placeholder="Search recipes" class="form-control mr-2">
      <button (click)="onSearch()" class="btn btn-primary">Search</button>
    </div>
  `,
  imports: [CommonModule, FormsModule]
})
export class SearchBarComponent {
  query: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.query);
  }
}
