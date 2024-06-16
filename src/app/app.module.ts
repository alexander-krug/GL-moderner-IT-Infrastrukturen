import { NgModule } from '@angular/core';
import { CoreModule } from './core.module';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        SharedModule,
        CoreModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
