import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-filter-dialog',
  template: `
    <h1>Filters</h1>
    <div>
      <label for="cuisine">Cuisine:</label>
      <select id="cuisine" [(ngModel)]="data.cuisine" class="form-control">
        <option value="">All</option>
        <option *ngFor="let cuisine of cuisines" [value]="cuisine">{{ cuisine }}</option>
      </select>
    </div>
    <div>
      <h3>Exclude Intolerances:</h3>
      <div class="intolerances-grid">
        <div *ngFor="let intolerance of intolerances">
          <label>
            <input type="checkbox" [value]="intolerance" (change)="onIntoleranceChange($event)">
            {{ intolerance }}
          </label>
        </div>
      </div>
    </div>
    <div>
      <button class="btn btn-secondary" (click)="onCancel()">Cancel</button>
      <button class="btn btn-primary" (click)="onApply()">Apply</button>
    </div>
  `,
  imports: [CommonModule, FormsModule],
  styles: [`
    h1 {
      text-align: center;
      margin-bottom: 1rem;
    }
    div {
      margin-bottom: 1rem;
    }
    .intolerances-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    label {
      display: block;
      margin: 0.5rem 0;
    }
    button {
      margin-right: 1rem;
    }
    .btn {
      margin-top: 1rem;
    }
  `]
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
    @Inject(MAT_DIALOG_DATA) public data: { cuisine: string, selectedIntolerances: string[] }
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
