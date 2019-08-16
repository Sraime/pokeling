import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankListComponent } from './bank-list.component';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { BankService } from '../../services/bank/bank.service';
import { of } from 'rxjs';
import { MatTableModule, MatChipsModule, MatTooltipModule } from '@angular/material';

describe('BankListComponent', () => {
  let component: BankListComponent;
  let fixture: ComponentFixture<BankListComponent>;
  let bankService : BankService;
  let spyGetOwned = jest.fn().mockReturnValue(of())
  let spyUpdateListOwned = jest.fn();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ BankListComponent ],
      providers: [ 
        {
          provide: BankService,
          useValue: {
            getObsevableOwnedPokemons: spyGetOwned,
            updateList: spyUpdateListOwned
          },
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ],
      imports: [MatTableModule, MatChipsModule, MatTooltipModule]
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
        {name_fr: 'Pitchu', name_en: 'Pitchu', userPseudo: 'admin', tags: []},
        {name_fr: 'Poke2', name_en: 'Poke2', userPseudo: 'admin', tags: [
          {name_fr: 'Ability1', type: 'ability'},
          {name_fr: 'Nature1', type: 'nature'},
          {name_fr: 'Move1', type: 'move'}
        ]},
        {name_fr: 'Poke3', name_en: 'Poke3', userPseudo: 'admin', tags: [
          {name_fr: 'Ability2', type: 'ability'},{name_fr: 'Ability3', type: 'ability'},
          {name_fr: 'Nature2', type: 'nature'},{name_fr: 'Nature3', type: 'nature'},
          {name_fr: 'Move2', type: 'move'},{name_fr: 'Move3', type: 'move'}
        ]}
      ];
      spyGetOwned.mockReturnValue(of(owned))
    });

    it('should subscribe to the bank service', () => {
      component.ngOnInit();
      expect(bankService.getObsevableOwnedPokemons).toHaveBeenCalled();
      expect(component.pokemons.length).toEqual(owned.length);
    });
    
    it('should request an update of owned pokemons list', () => {
      component.ngOnInit();
      expect(spyUpdateListOwned).toHaveBeenCalled();
    });

    it('should have 3 row with Pitchu', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const col = fixture.debugElement.nativeElement.querySelector('#bank-table tbody');
        expect(col.children.length).toEqual(3);
      });
    }));

    it('should have a row with Pitchu', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const col = fixture.debugElement.nativeElement.querySelector('#bank-table tbody tr:first-child td:first-child');
        expect(col.textContent.trim()).toEqual("Pitchu");
      });
    }));
    
    describe('columns without a tag given', () => {
      const columns = ['ability', 'nature', 'move']
      columns.forEach((columnTag, index) => {
        it('should have a "-" displayed when the '+columnTag+' tag', async(() => {
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            const col = fixture.debugElement.nativeElement.querySelector('#bank-table tbody tr:nth-child(1) td:nth-child('+(index+2)+')');
            expect(col.textContent.trim()).toEqual('-');
          });
        }));
      });
    });

    describe('columns with 1 tag given', () => {
      const columns = ['ability', 'nature', 'move']
      columns.forEach((columnTag, index) => {
        it('should have the '+columnTag+' tag displayed', async(() => {
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            const col = fixture.debugElement.nativeElement.querySelector('#bank-table tbody tr:nth-child(2) td:nth-child('+(index+2)+')');
            expect(col.textContent.trim()).toEqual(owned[1].tags[index].name_fr);
          });
        }));
      })
    });

    describe('columns with multiple tags given', () => {
      const columns = ['ability', 'nature', 'move']
      columns.forEach((columnTag, index) => {
        it('should have the number of '+columnTag+' tag displayed and a tooltip containing the list of them', async(() => {
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            const col = fixture.debugElement.nativeElement.querySelector('#bank-table tbody tr:nth-child(3) td:nth-child('+(index+2)+')');
            expect(col.textContent.trim()).toEqual(component.pokemons[2][columnTag].length+'');
            let expectedTooltips = '';
            const chip = col.querySelector('.tag-value');
            component.pokemons[2][columnTag].forEach((e) => expectedTooltips+=e.name_fr+' ');
            expect(chip.getAttribute('ng-reflect-message')).toEqual(expectedTooltips.trim())
          });
        }));
      })
    });
  });

  it('should have a table', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table#bank-table'));
      expect(table).toBeTruthy();
    });
  }));

  describe('headers', () => {
    const columnNames = ['Espèce', 'Talent(s)', 'Nature(s)', 'Attaque(s)']
    columnNames.forEach((columnName, index) => {
      it('should have the first column with the header '+columnName, async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const col = fixture.debugElement.nativeElement.querySelector('#bank-table th:nth-child('+(index+1)+')');
          expect(col.textContent).toEqual(columnName);
        });
      }));
    })
  });
});