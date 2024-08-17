import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  template: `
    <div class="input-group search-bar mb-3">
      <input
        [(ngModel)]="query"
        type="search"
        class="form-control rounded"
        placeholder="Search"
        aria-label="Search"
        aria-describedby="search-addon"
      />
      <button
        (click)="onSearch()"
        class="input-group-text border-0"
        id="search-addon"
      >
        <i class="fas fa-search"></i>
      </button>
    </div>
  `,
  imports: [CommonModule, FormsModule, MatDialogModule],
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  query: string = '';
  selectedCuisine: string = '';
  selectedIntolerances: string[] = [];
  @Output() search = new EventEmitter<{
    query: string;
    cuisine: string;
    intolerances: string[];
  }>();

  constructor(private dialogService: DialogService) {}

  onSearch(): void {
    this.search.emit({
      query: this.query,
      cuisine: this.selectedCuisine,
      intolerances: this.selectedIntolerances,
    });
  }

  async openFilterDialog(): Promise<void> {
    const result = await this.dialogService.openFilterDialog({
      cuisine: this.selectedCuisine,
      selectedIntolerances: this.selectedIntolerances,
    });

    if (result) {
      this.selectedCuisine = result.cuisine;
      this.selectedIntolerances = result.selectedIntolerances;
      this.search.emit({
        query: this.query,
        cuisine: this.selectedCuisine,
        intolerances: this.selectedIntolerances,
      });
    }
  }
}
