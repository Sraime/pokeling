import { Component, OnInit, Input, Inject } from '@angular/core';
import { OwnedPokemon } from '../../interfaces/owned-response';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit {

  owned: OwnedPokemon;
  natureTags: String[] = [];
  abilityTags: String[] = [];
  moveTags: String[] = [];
  otherTags: String[] = [];
  title: String = "";

  constructor(public dialogRef: MatDialogRef<BankDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OwnedPokemon) {
      this.owned = data;
    }

  ngOnInit() {
    if(this.owned){
      this.title = this.owned.name_fr;
      this.owned.tags.forEach(tag => {
        switch (tag.type) {
          case 'nature': this.natureTags.push(tag.name_fr); break;
          case 'ability': this.abilityTags.push(tag.name_fr); break;
          case 'move': this.moveTags.push(tag.name_fr); break;
          default: this.otherTags.push(tag.name_fr); break;
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
