import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { BankFormComponent } from './bank-form.component';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { TagService } from '../../services/tag/tag.service';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BankService } from '../../services/bank/bank.service';

describe('BankFormComponent', () => {
  let component: BankFormComponent;
  let fixture: ComponentFixture<BankFormComponent>;
  let spySearchPokemon = jest.fn();
  let spySearchTag = jest.fn();
  let spyAddOwnedPokemon = jest.fn();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ BankFormComponent ],
      providers: [
        FormBuilder,
        {
          provide: PokemonService,
          useValue: {searchPokemon: spySearchPokemon}
        },
        {
          provide: TagService,
          useValue: {searchTag: spySearchTag}
        },
        {
          provide: BankService,
          useValue: {addOwnedPokemon: spyAddOwnedPokemon}
        }
      ],
      imports: [
        FormsModule, ReactiveFormsModule, HttpClientModule,
        MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule,
        BrowserAnimationsModule
      ]
    })
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BankFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    spySearchPokemon.mockClear();
    spySearchPokemon.mockReturnValue(of(null))
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const form = fixture.debugElement.query(By.css('form#bank-add-form'));
        expect(form).toBeTruthy();
      });
  }));
  
  describe('field pokemon', () => {

    it('should have an input field pokemon in the form', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('#bank-add-form #bank-pokemon-field input[type="text"]#bank-pokemon-input'));
        expect(input).toBeTruthy();
      });
    }));
    
    it('should have an empty default value', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('#bank-pokemon-input'));
        expect(input.nativeElement.value).toEqual('');
      });
    }));

// ! can't spy the refresh method
    /** 
    FIXME
    it('should handle refreshing 2 secondes after the value change', fakeAsync(() => {
      let f = jest.spyOn(BankFormComponent.prototype,'refreshAutocompPokemon');
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('#bank-pokemon-input')).nativeElement;
      input.value = "P";
      input.dispatchEvent(new Event('keyup'));
      tick(2000)
      expect(f).toHaveBeenCalledWith("P");
    }));
    **/

    it('should call the pokemon service when the refresh function is called', () => {
      component.refreshAutocompPokemon('V')
      expect(spySearchPokemon).toHaveBeenCalledWith('V');
    });
    
    it('should update the list of suggestions with the result of the pokemon service', fakeAsync(() => {
      const returnedPokemon = [{name_fr:'poke1'},{name_fr:'poke2'}];
      spySearchPokemon.mockReturnValue(of(returnedPokemon));
      component.refreshAutocompPokemon('p')
      expect(component.pokemonOptions).toEqual(returnedPokemon);
    }));

    it('should clean the input on lost focus when the pokemon is not in suggestions', async(() => {
      const returnedPokemon = [{_id: '', name_fr:'poke1'},{_id: '', name_fr:'poke2'}];
      component.pokemonOptions = returnedPokemon;
      component.form.controls['pokemon'].setValue('p');
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('#bank-pokemon-input')).nativeElement;
        input.dispatchEvent(new Event('blur'));
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(input.value).toEqual('');
        });
      });
    }));
    
    it('should keep the input filled on lost focus when the pokemon is in suggestions', async(() => {
      const returnedPokemon = [{_id: '', name_fr:'poke1'},{_id: '', name_fr:'poke2'}];
      component.pokemonOptions = returnedPokemon;
      component.form.controls['pokemon'].setValue('poke1');
      fixture.whenStable().then(() => {
        const input = fixture.debugElement.query(By.css('#bank-pokemon-input')).nativeElement;
        input.dispatchEvent(new Event('blur'));
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(input.value).toEqual('poke1');
        });
      });
    }));
  });

  describe('tags field', () => {
    let input;

    beforeEach(() => {
      input = fixture.debugElement.query(By.css('#bank-add-form #bank-tags-field input[type="text"]#bank-tags-input'));
      spySearchTag.mockReturnValue(of([]));
    });
    
    it('should have an input in the form', () => {
      expect(input).toBeTruthy();
    });
    
    it('should be an input in a material chips list', () => {
      const path = fixture.debugElement.query(By.css('#bank-tags-field mat-chip-list #bank-tags-input'));
      expect(path).toBeTruthy();
    })
    
    it('should be a material input autocomplete', () => {
      const path = fixture.debugElement.query(By.css('#bank-tags-field mat-autocomplete'));
      expect(path).toBeTruthy();
      expect(component.tagsOptions).toBeDefined();
    })
    
    it('should display a list of chips for selected tags', async(() => {
      component.selectedTags = [{_id: '', name_fr: 'calme', type: 'nature'}];
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const chip = fixture.debugElement.query(By.css('#bank-tags-field mat-chip-list mat-chip .chip-value'));
        expect(chip.nativeElement.textContent.trim()).toEqual('calme');
      });
    }))
    
    it('should remove tag from the selectedTags when the chip is removed', async(() => {
      component.selectedTags = [{_id: '', name_fr: 'calme', type: 'nature'}];
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const chipRemoveIcon = fixture.debugElement.query(By.css('#bank-tags-field mat-chip-list mat-chip .chip-remove-icon'));
        chipRemoveIcon.nativeElement.dispatchEvent(new Event('click'));
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const chip = fixture.debugElement.query(By.css('#bank-tags-field mat-chip-list mat-chip'));
          expect(chip).toBeFalsy();
        });
      });
    }))
    
    it('should add a chip when a tag is selected', async(() => {
      const selectedTag = {_id: '', name_fr: 'calme', type: 'nature'}
      component.selectedTags = [];
      component.tagsOptions = [selectedTag];
      component.selectTag(selectedTag.name_fr);
      expect(component.selectedTags).toEqual([selectedTag]);
    }));
    
    it('should clean the input on lost focus if the tag not exist', async(() => {
      input.nativeElement.value = 'p';
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(input.nativeElement.value).toEqual('');
      });
    }));

    it('should update suggestions with the tag service on refresh', () => {
      const returnedTags = [{name_fr: 'calme', type: 'nature'}]
      spySearchTag.mockReturnValue(of(returnedTags))
      component.refreshAutocompTags('p');
      expect(component.tagsOptions).toEqual(returnedTags);
    });
  });
  describe('submition', () => {
    let btn;

    beforeEach(() => {
      btn = fixture.debugElement.query(By.css('#bank-add-form button#bank-add-submit'));
      spyAddOwnedPokemon.mockReturnValue(of(null));
    });

    it('should have a button "Ajouter" for submiting the new owned pokemon', () => {
      expect(btn.nativeElement.textContent).toEqual('Ajouter');
    });

    it('should have submit button disabled when the pokemon is empty', () => {
      expect(btn.nativeElement.disabled).toBeTruthy();
    });

    it('should have submit button disabled when the pokemon is not empty', async(() => {
      component.form.controls['pokemon'].setValue('poke');
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(btn.nativeElement.disabled).toBeFalsy();
      });
    }));
    
    it('should call the service with the tags and pokemon ids', async(() => {
      component.form.controls['pokemon'].setValue('poke');
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component.selectedTags = [{_id: 'idtag', name_fr: 'tag', type:'tagtype'}];
        component.pokemonOptions = [{_id: 'idpoke', name_fr: 'poke'}];
        btn.nativeElement.click()
        expect(spyAddOwnedPokemon).toHaveBeenCalledWith('idpoke',['idtag']);
      });
    }));
  });
});
