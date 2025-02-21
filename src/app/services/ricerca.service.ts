import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';

@Injectable({
  providedIn: 'root'
})
export class RicercaService {

  constructor(private http: HttpClient) { }

  api_url = environment.api_url + 'measure/'


  getMeasureBySearch(form: any, latitude: any, longitude: any): Observable<any> {
    let body = this.buildSearchBody(form, latitude, longitude)
    return this.http.post<any>(this.api_url + 'search', body)
  }


  buildSearchBody(form: any, latitude: any, longitude: any){
    let body  = {
      users: form.workers.map((res: any) => res.username),
      latitude: latitude,
      longitude: longitude,
      distance: form.raggio,
      startDate: form.dateRange ? this.formattaData(form.dateRange[0]) : null,
      endDate: form.dateRange ? this.formattaData(form.dateRange[1]) : null
    }

    return body;
  }

  formattaData(data: Date): string {
    const anno = data.getFullYear();
    const mese = (data.getMonth() + 1).toString().padStart(2, '0'); 
    const giorno = data.getDate().toString().padStart(2, '0');
    return `${anno}-${mese}-${giorno}`;
  }
}
