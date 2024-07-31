import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://api.spoonacular.com/recipes/';
  private apiKey = environment.spoonacularApiKey;

  constructor(private http: HttpClient) {}

  getRecipes(query: string): Observable<any> {
    const url = `${this.apiUrl}search`;
    const params = {
      apiKey: this.apiKey,
      query: query
    };

    return this.http.get(url, { params }).pipe(
      map((response: any) => response.results.map((recipe: any) => ({
        ...recipe,
        image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
        sourceUrl: `https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`
      })))
    );
  }
}
