import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-intolerance-filter',
  template:  `
    <div class="intolerance-filter">
      <label *ngFor="let intolerance of intolerances" class="form-check-label">
        <input type="checkbox" class="form-check-input" [value]="intolerance" (change)="onIntoleranceChange($event)">
        {{ intolerance }}
      </label>
    </div>
  `,
  imports: [CommonModule, FormsModule],
})
export class IntoleranceFilterComponent {
  @Output() intolerancesChange = new EventEmitter<string[]>();

  intolerances: string[] = [
    'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 
    'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
  ];

  selectedIntolerances: string[] = [];

  onIntoleranceChange(event: any): void {
    const intolerance = event.target.value;
    if(event.target.checked) {
      this.selectedIntolerances.push(intolerance);
    } else {
      const index = this.selectedIntolerances.indexOf(intolerance);
      if (index > -1) this.selectedIntolerances.splice(index, 1);
    }
    this.intolerancesChange.emit(this.selectedIntolerances);
  }
}
