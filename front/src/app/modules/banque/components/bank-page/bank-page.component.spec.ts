import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPageComponent } from './bank-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BankPageComponent', () => {
  let component: BankPageComponent;
  let fixture: ComponentFixture<BankPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
