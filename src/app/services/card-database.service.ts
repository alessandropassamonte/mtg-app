import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';
export interface Edition {
  id: number;
  setId: string;
  setName: string;
  setType: string;
  setCode: string;
  setUri: string;
  setIcon: string;
  releaseDate:  Date;
  setSearchUri: string;
  scryfallSetUri: string;
  cardMarketName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardDatabaseService {


  apiUrl = environment.api_url + 'cardDatabase'; 

  constructor(private http: HttpClient) {}

  getEditions(page: number = 0, size: number = 10): Observable<{ content: Edition[], totalPages: number }> {
    return this.http.get<{ content: Edition[], totalPages: number }>(`${this.apiUrl + '/editions'}?page=${page}&size=${size}`);
  }

  getCardsByEdition(page: number = 0, size: number = 10, editionCode: string): Observable<{ content: Edition[], totalPages: number }> {
    return this.http.get<{ content: Edition[], totalPages: number }>(`${this.apiUrl + '/cardsEdition'}?page=${page}&size=${size}&editionCode=${editionCode}`);
  }
}
