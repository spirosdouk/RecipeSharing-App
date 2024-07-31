import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  `,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  query: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.query);
  }
}
