import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';

@Injectable({
  providedIn: 'root'
})
export class InformazioniGeneraliService {

  constructor(private http: HttpClient) { }

  api_url = environment.api_url + 'generalinformation/'


  getByUsername(): Observable<any> {
      return this.http.get<any>(this.api_url + 'retrieve')
  }
  save(inputForm: any): Observable<any> {
    let body = this.createBody(inputForm)
    return this.http.post<any>(this.api_url + 'save', body)
  }

  createBody(inputForm:any){
    if(inputForm.fototipo){
      inputForm.phototype = {
        id: inputForm.fototipo
      }
    }
    if(inputForm.works){
      inputForm.works = inputForm.works.map((id: any) => ({ id }));
    }
    if(inputForm.sports){
      inputForm.sports = inputForm.sports.map((id: any) => ({ id }));
    }
    return inputForm
  }
}
