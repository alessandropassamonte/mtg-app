import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CardScanComponent } from './components/login/card-scan/card-scan.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'login',  loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)},
  { path: 'scan', component: CardScanComponent},
  { path: 'welcome',  component: WelcomeComponent},
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) , canActivate: [AuthGuard]},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
