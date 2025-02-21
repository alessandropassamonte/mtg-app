import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  errorMessage!: String;
  formLogin!: FormGroup
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }
  ngOnInit() {
    this.formLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      ruolo: ['1', [Validators.required]],
      keepConnection: [false, [Validators.required]],
    })
  }
  login() {
    this.authService.login(this.formLogin).subscribe({
      next: (res: any) => {
        this.errorMessage = ''
        const accessToken = res.token;
        localStorage.setItem('access_token', accessToken!);

        if (this.formLogin.get('keepConnection')?.value) {
          localStorage.setItem('keep_connection', this.formLogin.get('keepConnection')?.value);
        }

        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(res.token);
        localStorage.setItem('username', decodedToken?.sub);

        this.authService.setUser({
          username: decodedToken?.username,
        })

      

        this.authService.accessTokenSubject.next(accessToken);
        this.router.navigate(['home']);
      },
      error: (error) => {
        console.error('Errore durante il login:', error);
        this.errorMessage = 'Credenziali Errate'
      }
    })
  }

  




}
