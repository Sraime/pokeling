import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { OwnedPokemon } from '../../interfaces/owned-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BankService {

    constructor(private http: HttpClient) {}

    url = environment.api.bank.url;

    getOwnedPokemons() : Observable<Array<OwnedPokemon>> {
        return this.http.get<Array<OwnedPokemon>>(this.url);
    }

}