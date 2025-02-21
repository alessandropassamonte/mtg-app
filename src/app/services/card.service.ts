import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  api_url = environment.api_url
  api_uri = environment.api_uri

  getAllCardPaginated(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.api_url + 'card/all', { params: params })
  }


  search(page: any, size: any, search: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search);
    return this.http.get<any>(this.api_url + 'card/search', { params: params })
  }

  findByCardId(cardId: any): Observable<any> {
    const url = `${this.api_uri}/card/${cardId}`;
    return this.http.get<any>(url)
  }

  searchAutocomplete(searchValue: any): Observable<any> {
    let params = new HttpParams()
      .set('search', searchValue);
    return this.http.get<any>(this.api_url + 'card/searchAutocomplete', { params: params })
  }

  getPrice(card: Card){
      return this.http.post<any>(this.api_url + 'card/scraping', card)
  }

}
