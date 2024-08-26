import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingResultDialogComponent } from './booking-result-dialog.component';

describe('BookingResultDialogComponent', () => {
  let component: BookingResultDialogComponent;
  let fixture: ComponentFixture<BookingResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingResultDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
