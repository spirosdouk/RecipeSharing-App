import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-filter-dialog',
  template: `
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Filters and Ingredients</h5>
          <button type="button" class="close" (click)="onCancel()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="ingredient1">Enter Main Ingredients:</label>
            <input [(ngModel)]="data.ingredient1" id="ingredient1" placeholder="Ingredient 1" class="form-control mb-2">
            <input [(ngModel)]="data.ingredient2" id="ingredient2" placeholder="Ingredient 2" class="form-control mb-2">
            <input [(ngModel)]="data.ingredient3" id="ingredient3" placeholder="Ingredient 3" class="form-control mb-2">
          </div>
          <div class="form-group">
            <label for="cuisine">Cuisine:</label>
            <select id="cuisine" [(ngModel)]="data.cuisine" class="form-control">
              <option value="">All</option>
              <option *ngFor="let cuisine of cuisines" [value]="cuisine">{{ cuisine }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Exclude Intolerances:</label>
            <div class="intolerance-checkboxes">
              <div *ngFor="let intolerance of intolerances" class="form-check form-check-inline">
                <input type="checkbox" class="form-check-input" [value]="intolerance" (change)="onIntoleranceChange($event)">
                <label class="form-check-label">{{ intolerance }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer custom-modal-footer">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
          <button type="button" class="btn btn-primary" (click)="onApply()">Apply</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./filter-dialog.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FilterDialogComponent {
  cuisines: string[] = [
    'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 
    'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 
    'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 
    'Spanish', 'Thai', 'Vietnamese'
  ];

  intolerances: string[] = [
    'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 
    'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
  ];

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ingredient1: string, ingredient2: string, ingredient3: string, cuisine: string, selectedIntolerances: string[] }
  ) {}

  onIntoleranceChange(event: any): void {
    const intolerance = event.target.value;
    if (event.target.checked) {
      this.data.selectedIntolerances.push(intolerance);
    } else {
      const index = this.data.selectedIntolerances.indexOf(intolerance);
      if (index > -1) {
        this.data.selectedIntolerances.splice(index, 1);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    this.dialogRef.close(this.data);
  }
}
