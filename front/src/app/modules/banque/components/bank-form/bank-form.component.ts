import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Pokemon } from '../../interfaces/pokemon';
import { Tag } from '../../interfaces/tag';
import { TagService } from '../../services/tag/tag.service';
import { BankService } from '../../services/bank/bank.service';

@Component({
  selector: 'app-bank-form',
  templateUrl: './bank-form.component.html',
  styleUrls: ['./bank-form.component.scss']
})
export class BankFormComponent implements OnInit {
  
  form : FormGroup;

  @ViewChild('tagsInput', {static: false})
  tagsInput: ElementRef<HTMLInputElement>;

  pokemonOptions: Pokemon[] = [];
  tagsOptions: Tag[] = [];

  selectedTags: Tag[] = []
  subPokemonField: Subject<String> = new Subject<String>();
  subTagField: Subject<String> = new Subject<String>();

  constructor(
    private fb: FormBuilder, 
    private pokemonService: PokemonService, 
    private tagService: TagService, 
    private bankService: BankService) { }

  ngOnInit() {
    this.form = this.fb.group({
      pokemon: ['', [Validators.required]],
      tags: ['']
    })

    this.subPokemonField.pipe(debounceTime(500)).subscribe((v) => this.refreshAutocompPokemon(v))
    this.subTagField.pipe(debounceTime(500)).subscribe((v) => this.refreshAutocompTags(v))
  }

  refreshAutocompPokemon(term) {
    this.pokemonService.searchPokemon(term)
      .subscribe((result) => {
        this.pokemonOptions = result;
      })
  }

  refreshAutocompTags(term) {
    this.tagService.searchTag(term)
      .subscribe((result) => {
        this.tagsOptions = result;
      })
  }

  onBlurPokemon() {
    const selectedPokemon = this.form.controls['pokemon'].value;
    if(!this.pokemonOptions.find((e) => e.name_fr === selectedPokemon))
      this.form.controls['pokemon'].setValue('');
  }

  removeTag(tag) {
    const index = this.selectedTags.findIndex((t) => t.name_fr === tag.name_fr);
    this.selectedTags.splice(index,1);
  }

  selectTag(tagName) {
    let selected = this.tagsOptions.find((t) => t.name_fr === tagName);
    this.selectedTags.push(selected)
  }

  onBlurTags() {
    this.tagsInput.nativeElement.value = '';
  }

  onSubmit() {
    const selectedPokeName = this.form.controls['pokemon'].value;
    const selectedPoke = this.pokemonOptions.find((p) => p.name_fr === selectedPokeName);
    const selectedTagsIds = this.selectedTags.map((t) => t._id)
    this.bankService.addOwnedPokemon(selectedPoke._id, selectedTagsIds);
  }


}
