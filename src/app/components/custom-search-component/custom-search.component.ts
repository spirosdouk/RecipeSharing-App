import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { SearchService } from '../../services/search.service';
import { IngredientInputComponent } from '../ingredient-input-component/ingredient-input.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NavbarComponent } from '../navbar/navbar.component';
import { take, filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-custom-search',
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-3">
      <h1>Custom Search</h1>
      <button mat-button (click)="openFilterDialog()">Filters</button>
      <app-ingredient-input (search)="onIngredientSearch($event)"></app-ingredient-input>
      <div infiniteScroll [infiniteScrollDistance]="2" [infiniteScrollUpDistance]="1.5"
        [infiniteScrollThrottle]="150" (scrolled)="onScroll()">
        <ng-container *ngIf="recipes$ | async as recipes; else noRecipes">
          <app-recipe-list [recipes]="recipes"></app-recipe-list>
        </ng-container>
        <ng-template #noRecipes>
          <p>No recipes found.</p>
        </ng-template>
      </div>
      <div *ngIf="error$ | async as errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </div>
  `,
  imports: [CommonModule, FormsModule, IngredientInputComponent, RecipeListComponent, InfiniteScrollDirective, NavbarComponent],
})
export class CustomSearchComponent implements OnInit {
  recipes$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  query: string = 'pasta';
  intolerances: string[] = [];
  offset: number = 0;
  limit: number = 10;

  constructor(private recipeService: RecipeService, private searchService: SearchService, public dialog: MatDialog) {
    this.recipes$ = this.recipeService.recipes$;
    this.loading$ = this.recipeService.loading$;
    this.error$ = this.recipeService.error$;
  }

  ngOnInit(): void {
    this.searchService.searchEvent$.subscribe(searchParams => {
      this.query = searchParams.query;
      this.cuisine = searchParams.cuisine;
      this.intolerances = searchParams.intolerances;
      this.offset = 0;
      this.recipeService.getRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
    });

    this.recipeService.getRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
  }

  onIngredientSearch(ingredients: string): void {
    this.query = ingredients;
    this.offset = 0;
    this.recipeService.getRecipesByIngredients(ingredients);
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '300px',
      data: { cuisine: this.cuisine, selectedIntolerances: this.intolerances }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cuisine = result.cuisine;
        this.intolerances = result.selectedIntolerances;
        this.offset = 0;
        this.recipeService.getRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
      }
    });
  }

  onScroll(): void {
    this.loading$.pipe(
      take(1),
      filter(isLoading => !isLoading)
    ).subscribe(() => {
      this.offset += this.limit;
      this.recipeService.fetchMoreRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
    });
  }
}
