import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { ActivateComponent } from './activate/activate.component';

const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'activateuser/:token', component:ActivateComponent}
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
