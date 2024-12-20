/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StripeElementsComponent } from './stripe-elements.component';

describe('StripeElementsComponent', () => {
  let component: StripeElementsComponent;
  let fixture: ComponentFixture<StripeElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
