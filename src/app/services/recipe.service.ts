import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipesSubject = new BehaviorSubject<any[]>([]);
  recipes$: Observable<any[]> = this.recipesSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$: Observable<string | null> = this.errorSubject.asObservable();
  private apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';
  private apiKey = '5c3a715f75f04c1994f4ddb09646159e';

  constructor(private http: HttpClient) {}

  getRecipes(query: string, offset: number = 0, number: number = 10, cuisine?: string, intolerances?: string[]): void {
    if (this.loadingSubject.value) {
      return;
    }

    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('query', query)
      .set('offset', offset.toString())
      .set('number', number.toString());

    if (cuisine) {
      params = params.set('cuisine', cuisine);
    }

    if (intolerances && intolerances.length) {
      params = params.set('intolerances', intolerances.join(','));
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => {
        console.log('API Response:', response);
        return response.results.map((recipe: any) => ({
          ...recipe,
          image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
          sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-')}-${recipe.id}`
        }));
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (recipes) => {
        this.recipesSubject.next(recipes);
      },
      (error) => {
        this.errorSubject.next(error.message);
      }
    );
  }

  fetchMoreRecipes(query: string, offset: number, number: number, cuisine?: string, intolerances?: string[]): void {
    if (this.loadingSubject.value) {
      return;
    }

    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('query', query)
      .set('offset', offset.toString())
      .set('number', number.toString());

    if (cuisine) {
      params = params.set('cuisine', cuisine);
    }

    if (intolerances && intolerances.length) {
      params = params.set('intolerances', intolerances.join(','));
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => {
        console.log('API Response:', response);
        return response.results.map((recipe: any) => ({
          ...recipe,
          image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
          sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-')}-${recipe.id}`
        }));
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (recipes) => {
        const currentRecipes = this.recipesSubject.value;
        this.recipesSubject.next([...currentRecipes, ...recipes]);
      },
      (error) => {
        this.errorSubject.next(error.message);
      }
    );
  }

  getRecipesByIngredients(ingredients: string): void {
    if (this.loadingSubject.value) {
      return;
    }

    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('includeIngredients', ingredients)
      .set('number', '10');

    console.log('Request URL:', this.apiUrl);
    console.log('Request Params:', params.toString());

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => {
        console.log('API Response:', response);
        return response.results.map((recipe: any) => ({
          ...recipe,
          image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
          sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-')}-${recipe.id}`
        }));
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (recipes) => {
        this.recipesSubject.next(recipes);
      },
      (error) => {
        this.errorSubject.next(error.message);
      }
    );
  }
}
