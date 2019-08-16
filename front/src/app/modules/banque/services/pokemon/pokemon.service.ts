import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../../interfaces/pokemon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  url = environment.api.pokemon.url;

  searchPokemon(searchWord): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.url+"?search="+searchWord);
  }
}
