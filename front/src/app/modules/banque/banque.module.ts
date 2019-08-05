import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanqueRoutingModule } from './banque-routing.module';
import { BankListComponent } from './components/bank-list/bank-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material';
import { AuthInterceptor } from '../auth/auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [BankListComponent],
  imports: [
    CommonModule,
    BanqueRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class BanqueModule { }
