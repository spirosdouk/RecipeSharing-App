import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { SearchService } from '../../services/search.service';
import { RecipeService } from '../../services/recipe.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-navbar></app-navbar>
    <main class="content container mt-3">
      <app-search-bar></app-search-bar>
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
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    InfiniteScrollDirective,
    MatDialogModule,
    NavbarComponent,
    SearchBarComponent,
    RecipeListComponent
  ]
})
export class HomeComponent implements OnInit {
  recipes$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  query: string = 'pasta';
  cuisine: string = '';
  intolerances: string[] = [];
  offset: number = 0;
  limit: number = 10;

  constructor(
    private recipeService: RecipeService,
    private searchService: SearchService
  ) {
    this.recipes$ = this.recipeService.recipes$;
    this.loading$ = this.recipeService.loading$;
    this.error$ = this.recipeService.error$;
  }

  ngOnInit(): void {
    this.searchService.searchEvent$.subscribe(searchParams => {
      this.recipeService.getRecipes(searchParams.query, this.offset, this.limit, searchParams.cuisine, searchParams.intolerances);
    });

    this.recipeService.getRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
  }

  onScroll(): void {
    if (!this.loading$) {
      this.offset += this.limit;
      this.recipeService.fetchMoreRecipes(this.query, this.offset, this.limit, this.cuisine, this.intolerances);
    }
  }
}
