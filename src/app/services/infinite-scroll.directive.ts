import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective {
  @Output() scrolled = new EventEmitter<void>();

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log('Scrolled to the bottom');
      this.scrolled.emit();
    }
  }
}
