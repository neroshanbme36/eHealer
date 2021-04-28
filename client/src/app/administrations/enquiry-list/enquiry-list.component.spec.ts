/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnquiryListComponent } from './enquiry-list.component';

describe('EnquiryListComponent', () => {
  let component: EnquiryListComponent;
  let fixture: ComponentFixture<EnquiryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
