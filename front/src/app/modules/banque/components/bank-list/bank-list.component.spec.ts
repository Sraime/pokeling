import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankListComponent } from './bank-list.component';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { BankService } from '../../services/bank/bank.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material';

describe('BankListComponent', () => {
  let component: BankListComponent;
  let fixture: ComponentFixture<BankListComponent>;
  let bankService : BankService;
  let spyGetOwned = jest.fn().mockReturnValue(of())

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ BankListComponent ],
      providers: [ 
        {
          provide: BankService,
          useValue: {getOwnedPokemons: spyGetOwned},
        }
      ],
      imports: [MatTableModule]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bankService = TestBed.get(BankService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with owned pokemons', () => {
    let owned;

    beforeEach(() => {
      owned = [
        {name_fr: 'Pitchu', name_en: 'Pitchu', userPseudo: 'admin', tags: []}
      ];
      spyGetOwned.mockReturnValue(of(owned))
    });

    it('should init pokemons with the bank service', () => {
      
      component.ngOnInit();
      expect(bankService.getOwnedPokemons).toHaveBeenCalled();
      expect(component.pokemons).toEqual(owned);
    });

  it('should have a row with Pitchu', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const col = fixture.debugElement.nativeElement.querySelector('#bank-table tbody tr:first-child td:first-child');
      expect(col.textContent.trim()).toEqual("Pitchu");
    });
  }));
  });

  it('should have a table', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table#bank-table'));
      expect(table).toBeTruthy();
    });
  }));

  it('should have the first column with the header Espèce', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const col = fixture.debugElement.nativeElement.querySelector('#bank-table th:first-child');
      expect(col.textContent).toEqual("Espèce");
    });
  }));
});
