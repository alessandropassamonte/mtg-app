import { Injectable } from '@angular/core';
import { environment } from '../../envioronment/environment'
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams, HttpRequest } from "@angular/common/http";
import * as CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../components/models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

 

  api_url = environment.api_url

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private keepConn = 'keep_connection'

  accessTokenSubject: BehaviorSubject<string | null>;
  userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);;
  public accessToken$: Observable<string | null>;


  constructor(private http: HttpClient, private datePipe: DatePipe, private router: Router) { 
    const accessToken = localStorage.getItem(this.accessTokenKey);
    this.accessTokenSubject = new BehaviorSubject<string | null>(accessToken);
    this.accessToken$ = this.accessTokenSubject.asObservable();
  }

  isAuthenticated() {
    let token = localStorage.getItem(this.accessTokenKey)
    if(token){

      const helper = new JwtHelperService();
      let decodedToken: any
      try{
        decodedToken  = helper.decodeToken(token);
      } catch {
        this.logout()
        return false
      }
      

      this.setUser({
        username: decodedToken?.sub,
      })
    }
    return token ? true : false;
  }

  login(inputForm: FormGroup){
    
    let body = {
      username: inputForm.get('username')?.value,
      password: inputForm.get('password')?.value,
    }
    return this.http.post<any>(this.api_url + 'auth/login', body)
}


  registrazione(inputForm: FormGroup) {

    let body = {
      username: inputForm.get('username')?.value,
      password: this.encryptPassword(inputForm.value?.password),
      name: inputForm.get('nome')?.value,
      lastName: inputForm.get('cognome')?.value,
      email: inputForm.get('email')?.value,
      birthDate: this.datePipe.transform(inputForm.get('dataNascita')?.value, 'dd/MM/yyyy'),
      role: inputForm.get('ruolo')?.value,
      
    }
    return this.http.post<any>(this.api_url + 'login/user', body)
  }

  setUser(input: User){
    this.userSubject.next(input) 
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getToken() {
    return this.accessTokenSubject.value;
  }

  public logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem('username');
    this.accessTokenSubject.next(null);
    this.router.navigate(['login']);

  }

  encryptPassword(password: string): string {
    const secretKey = CryptoJS.enc.Utf8.parse(environment.AES_key);
    const plaintextPassword = password;
    const encryptedBytes = CryptoJS.AES.encrypt(plaintextPassword, secretKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encryptedBytes.toString();
  }

  decryptPassword(passwordEncr: any){
    // Decrypt the ciphertext password
    const decryptedBytes = CryptoJS.AES.decrypt(passwordEncr, environment.AES_key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });

  return decryptedBytes.toString(CryptoJS.enc.Utf8);
  }

  
  getAllRoles(): Observable<any[]> {
    return this.http.get<any>(this.api_url + 'login/getRoles')
  }

  activateUser(token: any): Observable<any[]> {
    return this.http.get<any>(this.api_url + 'login/activateuser/' + token)
  }


  public refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<any>(`${this.api_url}refresh-token`, { refreshToken })
      .pipe(
        tap(response => {
          const accessToken = response.access_token;
          localStorage.setItem(this.accessTokenKey, accessToken);
          this.accessTokenSubject.next(accessToken);
        })
      );
  }


}

