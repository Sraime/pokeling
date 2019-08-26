import { Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { OwnedPokemon } from '../../interfaces/owned-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { HttpOptionsBuilder } from '../../../auth/libs/HttpOptionsBuilder/HttpOptionsBuilder';

@Injectable({
    providedIn: 'root'
})
export class BankService {

    constructor(private http: HttpClient, private httpob: HttpOptionsBuilder) {}

    url = environment.api.bank.url;

    subOwnedPokemons: Subject<Array<OwnedPokemon>> = new Subject<Array<OwnedPokemon>>();
    
    cachedOwnedPkemons: Array<OwnedPokemon> = [];

    getObsevableOwnedPokemons() : Subject<Array<OwnedPokemon>> {
        return this.subOwnedPokemons;
    }

    updateList(): void{
        this.http.get<Array<OwnedPokemon>>(this.url).subscribe( (ops) => {
            this.cachedOwnedPkemons = ops;
            this.dispatchUpdate();
        })
    }

    addOwnedPokemon(idpoke, tagsIds) {
        let h = this.httpob.getHeader();
        this.http.post<OwnedPokemon>(this.url, {pokemonId: idpoke, tagsIds: tagsIds}, {headers: h})
            .subscribe((nop) => {
                this.cachedOwnedPkemons.push(nop);
                this.dispatchUpdate();
            });
    }

    dispatchUpdate() {
        this.subOwnedPokemons.next(JSON.parse(JSON.stringify(this.cachedOwnedPkemons)));
    }

    deleteOwnedPokemon(idpoke: string): void{
        const header = this.httpob.getHeader();
        this.http.delete(this.url+'/'+idpoke, {headers: header})
            .subscribe((result) => {
                const index = this.cachedOwnedPkemons.findIndex((p) => p._id === idpoke);
                this.cachedOwnedPkemons.splice(index,1);
                this.dispatchUpdate();
            });
    }

}