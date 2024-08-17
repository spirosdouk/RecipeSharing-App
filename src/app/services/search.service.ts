import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchEventSource = new BehaviorSubject<{
    query: string;
    cuisine: string;
    intolerances: string[];
  }>({
    query: 'pasta',
    cuisine: '',
    intolerances: [],
  });
  searchEvent$ = this.searchEventSource.asObservable();

  emitSearchEvent(searchParams: {
    query: string;
    cuisine: string;
    intolerances: string[];
  }): void {
    this.searchEventSource.next(searchParams);
  }
}
