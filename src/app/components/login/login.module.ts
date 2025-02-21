import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ActivateComponent } from './activate/activate.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CardScanComponent } from './card-scan/card-scan.component';
import { IonicModule } from '@ionic/angular';




@NgModule({
  declarations: [LoginComponent, LoginFormComponent, RegistrationFormComponent, ActivateComponent, CardScanComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    BsDatepickerModule,
    IonicModule,
    AlertModule
  ]
  
})
export class LoginModule { }
