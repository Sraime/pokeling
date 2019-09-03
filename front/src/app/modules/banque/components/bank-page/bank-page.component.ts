import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bank-page',
  templateUrl: './bank-page.component.html',
  styleUrls: ['./bank-page.component.scss']
})
export class BankPageComponent implements OnInit {

  targetUserPseudo: String = null;

  constructor(private route: ActivatedRoute) { 
  }

  ngOnInit() {
    this.targetUserPseudo = this.route.snapshot.paramMap.get('pseudo');
  }

}
