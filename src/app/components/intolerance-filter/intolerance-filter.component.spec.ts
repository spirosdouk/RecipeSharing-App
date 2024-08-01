import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntoleranceFilterComponent } from './intolerance-filter.component';

describe('IntoleranceFilterComponent', () => {
  let component: IntoleranceFilterComponent;
  let fixture: ComponentFixture<IntoleranceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntoleranceFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntoleranceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
