import { TestBed, async } from '@angular/core/testing';

import { BankService } from './bank.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpOptionsBuilder } from '../../../auth/libs/HttpOptionsBuilder/HttpOptionsBuilder'


describe('BankService', () => {
  const spyGet = jest.fn();
  const spyPost = jest.fn();
  const spyGetHeader = jest.fn();
  let service: BankService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: {
          get: spyGet,
          post: spyPost
        }
      }, 
      {
        provide: HttpOptionsBuilder,
        useValue: {getHeader: spyGetHeader}
      }
    ],
    imports: [ HttpClientModule ]
  }));

  beforeEach(() => {
    service = TestBed.get(BankService);
    spyGet.mockReturnValue(of(null));
    spyGet.mockClear();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateList()', () => {

    it('should send a get request with the http client', () => {
      service.updateList();
      expect(spyGet).toHaveBeenCalled();
    });

    it('should trigger observer with the result of the request', () => {
      const returnedOwnedPokemons = [{_id: '', name_fr: 'poke', userPseudo:'admin', tags: []}];
      spyGet.mockReturnValue(of(returnedOwnedPokemons));
      let dataSubscriberCall;
      service.getObsevableOwnedPokemons().subscribe((r) => {
        dataSubscriberCall = r;
      });
      service.updateList();
      expect(dataSubscriberCall).toEqual(returnedOwnedPokemons);
    });
    
  });

  describe('addOwnedPokemon()', () => {
    const buildedHeader = {};
    spyGetHeader.mockReturnValue(buildedHeader);

    beforeEach(() => {
      spyPost.mockReturnValue(of(null));
      spyPost.mockClear();
    });

    it('should send a post request with given ids', () => {
      service.addOwnedPokemon('pokeid',['tagid']);
      expect(spyPost).toHaveBeenCalledWith(
        expect.any(String),
        {pokemonId:'pokeid', tagsIds: ['tagid']},
        {headers: buildedHeader}
      );
    });

    it('should trigger bank subscribers', async(() => {
      let dataSubscriberCall;
      const cachedOwnedPokemons = [{_id: 'pokeid', name_fr: 'poke', userPseudo:'admin', tags: []}];
      service.cachedOwnedPkemons = cachedOwnedPokemons;
      const createdOwnedPokemon = {_id: 'npokeid', name_fr: 'npoke', userPseudo:'admin', tags: []};
      spyPost.mockReturnValue(of(createdOwnedPokemon));
      service.getObsevableOwnedPokemons().subscribe((data) => {
        dataSubscriberCall = data;
      })
      service.addOwnedPokemon('npokeid', []);
      expect(dataSubscriberCall).toEqual([cachedOwnedPokemons[0],createdOwnedPokemon]);
    }));
  });
  
  describe('dispatchUpdate()', () => {
    
    it('should not affect cached list when modify the result of the subscribe', (done) => {
      let cachedOwnedPokemons = [{_id: 'pokeid', name_fr: 'poke', userPseudo:'admin', tags: []}];
      service.cachedOwnedPkemons = cachedOwnedPokemons;
      service.getObsevableOwnedPokemons().subscribe((data) => {
        data.pop();
        expect(cachedOwnedPokemons.length).toEqual(1);
        done();
      })
      service.dispatchUpdate();
    });
  });
});
