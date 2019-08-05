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
      this.pokemons = data;
    })
  }

}
