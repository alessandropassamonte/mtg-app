import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';
import { UserCard } from '../models/user-card';

@Injectable({
  providedIn: 'root'
})
export class UserCardService {

  constructor(private http: HttpClient) { }

  api_url = environment.api_url + 'usercard/'

  getCardByUser(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.http.get<any>(this.api_url + 'cards', { params: params })
  }

  addCardToUser(userCard: UserCard): Observable<any> {
    return this.http.post<any>(this.api_url + 'addCards', userCard)
  }

  addAllToUser(userCards: UserCard[]): Observable<any> {
    return this.http.post<any>(this.api_url + 'addAll', userCards)
  }

  update(userCard: UserCard){
    return this.http.post<any>(this.api_url + 'update', userCard)
  }

  searchAutocomplete(searchValue: any): Observable<any> {
    let params = new HttpParams()
      .set('search', searchValue);
    return this.http.get<any>(this.api_url + 'searchAutocomplete', { params: params })
  }
}
