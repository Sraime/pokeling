import { Component, OnInit } from '@angular/core';
import { BankService } from '../../services/bank/bank.service';
import { OwnedPokemon } from '../../interfaces/owned-response';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent implements OnInit {

  pokemons: Array<OwnedPokemon>;

  constructor(private bankService: BankService) { }

  ngOnInit() {
    this.bankService.getOwnedPokemons().subscribe((data) => {
      this.pokemons = data.map((e) => {
        e.tags.forEach((t) => {
          e[t.type+''] ? e[t.type+''].push(t) : e[t.type+''] = [t];
          if (!e[t.type+'InlineTags']) 
            e[t.type+'InlineTags'] = t.name_fr
          else 
            e[t.type+'InlineTags'] += ' '+t.name_fr;
        })
        return e;
      });
    })
  }

}
