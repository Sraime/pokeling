import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginActivate } from '../auth/LoginActivateGuard';
import { BankPageComponent } from './components/bank-page/bank-page.component';


const routes: Routes = [
  { path: 'bank', component: BankPageComponent, canActivate: [LoginActivate]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LoginActivate]
})
export class BanqueRoutingModule { }
