import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProceedDialogComponent } from './order-proceed-dialog.component';

describe('OrderProceedDialogComponent', () => {
  let component: OrderProceedDialogComponent;
  let fixture: ComponentFixture<OrderProceedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProceedDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderProceedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
