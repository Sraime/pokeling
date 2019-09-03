import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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

  displayedColumns: string[];

  @Input('userPseudo')
  onUserPseudo: String = null;

  constructor(private bankService: BankService, private dialogDetail: MatDialog) { }

  ngOnInit() {
    let obsList = this.onUserPseudo ? 
      this.bankService.getObsevableOwnedPokemons(this.onUserPseudo)
      : this.bankService.getObsevableOwnedPokemons();

    this.listSubscriber = obsList.subscribe((data) => {
        this.updateList(data);
      });
    this.displayedColumns = ['espece','ability','nature','move'];
    if(!this.onUserPseudo){
      this.displayedColumns.push('options');
      this.bankService.fetchData();
    }
  }

  ngOnDestroy() {
    this.listSubscriber.unsubscribe();
  }

  selectRow(rowData){
    this.dialogDetail.open(BankDetailComponent, {width: '50%', data: rowData})
  }

  deletePokemon(idpoke, event) {
    this.bankService.deleteOwnedPokemon(idpoke);
    event.stopPropagation()
  }

  updateList(data) {
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
  }
}
