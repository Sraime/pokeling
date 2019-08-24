import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankService } from '../../services/bank/bank.service';
import { OwnedPokemon } from '../../interfaces/owned-response';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { BankDetailComponent } from '../bank-detail/bank-detail.component';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit, OnDestroy{

  pokemons: Array<OwnedPokemon>;

  listSubscriber: Subscription;

  constructor(private bankService: BankService, private dialogDetail: MatDialog) { }

  ngOnInit() {
    this.listSubscriber = this.bankService.getObsevableOwnedPokemons().subscribe((data) => {
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
    });
    this.bankService.updateList();
  }

  ngOnDestroy() {
    this.listSubscriber.unsubscribe();
  }

  selectRow(rowData){
    this.dialogDetail.open(BankDetailComponent, {width: '50%', data: rowData})
  }

}
