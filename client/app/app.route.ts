import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {DropOffComponent} from './drop-off/drop.off.component';
import {ForgotCodeComponent} from './forgot-code/forgot.code.component';
import {ScanLabelComponent} from './scan-label/scan.label.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    {
        path: '', component: AppComponent,
        children: [
            {path: '', component: MainComponent},
            {path: 'drop-off', component: DropOffComponent},
            {path: 'forgot-code', component: ForgotCodeComponent},
            {path: 'scan-label', component: ScanLabelComponent}
        ]
    }
];

export const AppRoutingProviders: any[] = [];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
