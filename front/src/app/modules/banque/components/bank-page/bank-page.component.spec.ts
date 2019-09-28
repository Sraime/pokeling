import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPageComponent } from './bank-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('BankPageComponent', () => {
  let component: BankPageComponent;
  let fixture: ComponentFixture<BankPageComponent>;
  let spyGetParamMap = jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankPageComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: { get: spyGetParamMap}}}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(BankPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyGetParamMap.mockClear();
    spyGetParamMap.mockReturnValue(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should set storedUsed pseudo with the url params when it exists', () => {
    spyGetParamMap.mockReturnValue('admin');
    component.ngOnInit();
    expect(spyGetParamMap).toHaveBeenCalledWith('pseudo');
    expect(component.targetUserPseudo).toEqual('admin');
  });

  describe('add form', () => {

    it('should display the form when the target user has not been set', async(() => {
      component.targetUserPseudo = null;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const form = fixture.debugElement.query(By.css('app-bank-form'));
        expect(form).toBeTruthy();
      });
    }));
  
    it('should not display the form when the target user has been set', async(() => {
      component.targetUserPseudo = 'Toto';
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const form = fixture.debugElement.query(By.css('app-bank-form'));
        expect(form).toBeFalsy();
      });
    }));

  });

  describe('welcome message', () => {
    
    it('should not display the welcome message when the target user is not set', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const pageTitle = fixture.debugElement.query(By.css('.page-title'));
        expect(pageTitle).toBeFalsy();
      });
    }))
    
    it('should display a welcome message with the pseudo of the target user', async(() => {
      component.targetUserPseudo = 'Toto';
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const pageTitle = fixture.debugElement.query(By.css('.page-title'));
        expect(pageTitle.nativeElement.textContent).toEqual('Banque de Toto');
      });
    }));
  });

});
