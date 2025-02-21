import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private jwtHelper: JwtHelperService) { }

  canActivate(): boolean {

    let tokeIntem = localStorage.getItem('access_token')
    try {
      if (this.authService.isAuthenticated() && !this.jwtHelper.isTokenExpired(tokeIntem)) {
        return true; // L'utente è autenticato, consenti l'accesso alla rotta
      } else {
        return this.handleError()
      }
    } catch {
      return this.handleError()
    }

  }

  handleError() {
    this.authService.logout()
    this.router.navigate(['/login']); // L'utente non è autenticato, reindirizza alla pagina di login
    return false;
  }

}