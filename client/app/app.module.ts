import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavBarComponent} from './navbar/navbar.component';
import {MainComponent} from './main/main.component';
import {DropOffComponent} from './drop-off/drop.off.component';
import {ForgotCodeComponent} from './forgot-code/forgot.code.component';
import {ScanLabelComponent} from './scan-label/scan.label.component';
import {Routing, AppRoutingProviders} from './app.route';

@NgModule({
    declarations: [
        AppComponent,
        NavBarComponent,
        MainComponent,
        DropOffComponent,
        ForgotCodeComponent,
        ScanLabelComponent
    ],
    imports: [
        BrowserModule,
        Routing
    ],
    providers: [AppRoutingProviders],
    bootstrap: [AppComponent]
})
export class AppModule {
}
