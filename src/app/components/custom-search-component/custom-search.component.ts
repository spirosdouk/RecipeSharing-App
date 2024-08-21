import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { RecipeService } from '../../services/recipe.service';
import { SearchService } from '../../services/search.service';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-custom-search',
  template: `
    <app-navbar></app-navbar>

    <section class="hero">
      <div class="hero-content">
        <h1>Find Your Perfect Recipe</h1>
        <p>
          Use our advanced filters to find the recipes that suit your taste and
          dietary needs.
        </p>
        <button class="btn btn-primary" (click)="openFilterDialog()">
          Apply Filters
        </button>
      </div>
    </section>

    <main class="content container mt-3">
      <ng-container *ngIf="recipes.length > 0; else noRecipes">
        <div
          infiniteScroll
          [infiniteScrollDistance]="2"
          [infiniteScrollThrottle]="150"
          (scrolled)="onScroll()"
        >
          <app-recipe-list [recipes]="recipes"></app-recipe-list>
        </div>
      </ng-container>
      <ng-template #noRecipes>
        <p class="alert alert-danger mt-3">No recipes found.</p>
      </ng-template>
      <div
        *ngIf="error$ | async as errorMessage"
        class="alert alert-danger mt-3"
      >
        {{ errorMessage }}
      </div>
      <div *ngIf="loading$ | async" class="spinner-border mt-3" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </main>
  `,
  styleUrls: ['./custom-search.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RecipeListComponent,
    NavbarComponent,
    InfiniteScrollDirective,
  ],
})
export class CustomSearchComponent implements OnInit, OnDestroy {
  recipes: any[] = [];
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  query: string = 'pasta';
  cuisine: string = '';
  intolerances: string[] = [];
  offset: number = 0;
  limit: number = 10;
  private destroy$ = new Subject<void>();
  private noMoreRecipes: boolean = false;
  private fetching: boolean = false;
  private savedRecipes: number[] = [];

  constructor(
    private recipeService: RecipeService,
    private searchService: SearchService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.loading$ = this.recipeService.loading$;
    this.error$ = this.recipeService.error$;
  }

  ngOnInit(): void {
    this.loadRecipes();

    this.searchService.searchEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchParams) => {
        this.query = searchParams.query;
        this.cuisine = searchParams.cuisine;
        this.intolerances = searchParams.intolerances;
        this.offset = 0;
        this.noMoreRecipes = false;
        this.loadRecipes();
      });

    this.recipeService.noMoreRecipes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((noMore) => {
        this.noMoreRecipes = noMore;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRecipes(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.recipeService
        .getSavedRecipesForUser(Number(userId))
        .pipe(
          switchMap((savedRecipeIds: number[]) => {
            this.savedRecipes = savedRecipeIds;
            return this.recipeService.getRecipes(
              this.query,
              this.offset,
              this.limit,
              this.cuisine,
              this.intolerances
            );
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (recipes) => {
            this.recipes = recipes;
            this.recipes.forEach((recipe) => {
              recipe.saved = this.savedRecipes.includes(recipe.id);
            });
          },
          error: (error) => {
            console.error('Error fetching recipes:', error);
          },
        });
    } else {
      this.recipeService
        .getRecipes(
          this.query,
          this.offset,
          this.limit,
          this.cuisine,
          this.intolerances
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (recipes) => {
            this.recipes = recipes;
          },
          error: (error) => {
            console.error('Error fetching recipes:', error);
          },
        });
    }
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: {
        ingredient1: this.query.split(',')[0] || '',
        ingredient2: this.query.split(',')[1] || '',
        ingredient3: this.query.split(',')[2] || '',
        cuisine: this.cuisine,
        selectedIntolerances: this.intolerances,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.query = [
            result.ingredient1,
            result.ingredient2,
            result.ingredient3,
          ]
            .filter((ingredient) => ingredient.trim() !== '')
            .join(',');
          this.cuisine = result.cuisine;
          this.intolerances = result.selectedIntolerances;
          this.offset = 0;
          this.noMoreRecipes = false;
          this.loadRecipes();
        }
      });
  }

  onScroll(): void {
    console.log('Scrolled to the bottom of the page');
    if (this.noMoreRecipes || this.fetching) {
      console.log('No more recipes to fetch or already fetching');
      return;
    }

    this.fetching = true;
    this.offset += this.limit;
    this.recipeService
      .fetchMoreRecipes(
        this.query,
        this.offset,
        this.limit,
        this.cuisine,
        this.intolerances
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipes) => {
          this.recipes.push(...recipes);
          this.fetching = false;
        },
        error: (error) => {
          console.error('Error fetching more recipes:', error);
          this.fetching = false;
        },
      });
  }
}
