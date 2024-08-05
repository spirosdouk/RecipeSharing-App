import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { SearchService } from '../../services/search.service';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-custom-search',
  template: `
    <app-navbar></app-navbar>

    <section class="hero">
      <div class="hero-content">
        <h1>Find Your Perfect Recipe</h1>
        <p>Use our advanced filters to find the recipes that suit your taste and dietary needs.</p>
        <button class="btn btn-primary" (click)="openFilterDialog()">Apply Filters</button>
      </div>
    </section>

    <main class="content container mt-3">
      <div infiniteScroll [infiniteScrollDistance]="2" [infiniteScrollUpDistance]="1.5"
        [infiniteScrollThrottle]="150" (scrolled)="onScroll()">
        <ng-container *ngIf="recipes$ | async as recipes; else noRecipes">
          <app-recipe-list [recipes]="recipes"></app-recipe-list>
        </ng-container>
        <ng-template #noRecipes>
          <p>No recipes found.</p>
        </ng-template>
      </div>
      <div *ngIf="error$ | async as errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </main>
  `,
  styleUrls: ['./custom-search.component.css'],
  imports: [CommonModule, FormsModule, RecipeListComponent, InfiniteScrollDirective, NavbarComponent],
})
export class CustomSearchComponent implements OnInit {
  recipes$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  query: string = 'pasta';
  cuisine: string = '';
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

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: { 
        ingredient1: this.query.split(',')[0] || '',
        ingredient2: this.query.split(',')[1] || '',
        ingredient3: this.query.split(',')[2] || '',
        cuisine: this.cuisine,
        selectedIntolerances: this.intolerances
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.query = [result.ingredient1, result.ingredient2, result.ingredient3]
          .filter(ingredient => ingredient.trim() !== '')
          .join(',');
        this.cuisine = result.cuisine;
        this.intolerances = result.selectedIntolerances;
        this.offset = 0;
        this.recipeService.getRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
      }
    });
  }

  onScroll(): void {
    this.loading$.subscribe(isLoading => {
      if (!isLoading) {
        this.offset += this.limit;
        this.recipeService.fetchMoreRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
      }
    });
  }
}
