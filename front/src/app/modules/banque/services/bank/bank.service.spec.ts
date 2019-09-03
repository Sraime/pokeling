import { TestBed, async } from '@angular/core/testing';

import { BankService } from './bank.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpOptionsBuilder } from '../../../auth/libs/HttpOptionsBuilder/HttpOptionsBuilder'
import { environment } from '../../../../../environments/environment';


describe('BankService', () => {
  const spyGet = jest.fn();
  const spyPost = jest.fn();
  const spyDelete = jest.fn();
  const spyGetHeader = jest.fn();
  const BASE_URL = environment.api.bank.url;
  let service: BankService;

  const buildedHeader = {};
  spyGetHeader.mockReturnValue(buildedHeader);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: {
          get: spyGet,
          post: spyPost,
          delete: spyDelete
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

  describe('fetchData()', () => {

    it('should send a get request with the http client', () => {
      service.fetchData();
      expect(spyGet).toHaveBeenCalled();
    });

    it('should trigger observer with the result of the request', () => {
      const returnedOwnedPokemons = [{_id: '', name_fr: 'poke', userPseudo:'admin', tags: []}];
      spyGet.mockReturnValue(of(returnedOwnedPokemons));
      let dataSubscriberCall;
      service.getObsevableOwnedPokemons().subscribe((r) => {
        dataSubscriberCall = r;
      });
      service.fetchData();
      expect(dataSubscriberCall).toEqual(returnedOwnedPokemons);
    });
    
  });

  describe('addOwnedPokemon()', () => {

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

  describe('deleteOwnedPokemon()', () => {
    const existingPoke = [
      {_id: 'idpoke', name_fr: '', userPseudo: '', tags: []}
    ]
    beforeEach(() => {
      service.cachedOwnedPkemons = existingPoke;
      spyDelete.mockClear();
      spyDelete.mockReturnValue(of(null));
    });

    it('should resquest the backend for deleting the pokemon', () => {
      service.deleteOwnedPokemon('idpoke');
      expect(spyDelete).toHaveBeenCalled();
      expect(spyDelete).toHaveBeenCalledWith(
        BASE_URL+'/idpoke', 
        {headers: buildedHeader});
    });

    it('should remove the pokemon from the cached list when operation succed', () => {
      service.deleteOwnedPokemon('idpoke');
      expect(service.cachedOwnedPkemons).toEqual([]);
    });

    it('should dispatch the deletion to all subscribers', (done) => {
      service.getObsevableOwnedPokemons().subscribe((list) => {
        expect(list).toEqual([]);
        done();
      })
      service.deleteOwnedPokemon('idpoke');
    });

    it('should not change de cached list if the operation fails', () => {
      spyDelete.mockReturnValue(throwError(new Error()))
      service.deleteOwnedPokemon('notExistingId');
      expect(service.cachedOwnedPkemons).toEqual(existingPoke);
    });
  });

  describe('getObsevableOwnedPokemons', () => {
    
    it('should return the stored Subject for no specific user', () => {
      const obs = service.getObsevableOwnedPokemons();
      expect(obs).toEqual(service.subOwnedPokemons);
    });
    
    it('should return a service call if it is for a specific user', (done) => {
      spyGet.mockReturnValue(of(null));
      service.getObsevableOwnedPokemons('admin')
      .subscribe((data) => {
        expect(spyGet).toHaveBeenCalledWith(BASE_URL+'/admin');
        done();
        })
    });
  });
});
