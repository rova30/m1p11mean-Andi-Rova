import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './views/examples.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './api/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import {initializeApp} from 'firebase/app';
import { ServiceService } from './api/service.service';

initializeApp(environment.firebase);

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        AppRoutingModule,
        ComponentsModule,
        ExamplesModule,
        AuthModule,
    ],
    providers: [
        AuthService,
        ServiceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
