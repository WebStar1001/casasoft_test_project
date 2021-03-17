import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import Amplify, { Auth } from 'aws-amplify';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import {TranslationModule} from '../i18n/translation.module';


Amplify.configure({
  Auth:{
    region: 'us-east-1',
    userPoolId: 'us-east-1_BQxNeElCu',
    userPoolWebClientId: '65m52dv5hv1nahismc6h7l030r',
  }
});
@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class AuthModule {}
