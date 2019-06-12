import {RouterModule, Routes } from '@angular/router'
import {ColasTrabajoComponent} from './components/colas-trabajo/colas-trabajo.component';


const APP_ROUTES: Routes = [

    // { path: '', component:LoginComponent },
    // { path: 'home', component: ConsumirComponent},
     { path: 'colas', component:ColasTrabajoComponent},
    // { path: 'Login', component:LoginComponent },
    // { path: '**', pathMatch: 'full' , redirectTo:'home'}

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);