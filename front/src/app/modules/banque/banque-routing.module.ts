import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankListComponent } from './components/bank-list/bank-list.component';
import { LoginActivate } from '../auth/LoginActivateGuard';

const routes: Routes = [
  { path: 'bank', component: BankListComponent, canActivate: [LoginActivate]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LoginActivate]
})
export class BanqueRoutingModule { }
