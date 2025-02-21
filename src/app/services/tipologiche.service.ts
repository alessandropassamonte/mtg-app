import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';

@Injectable({
  providedIn: 'root'
})
export class TipologicheService {


  api_url = environment.api_url
  constructor(private http: HttpClient) { }

  getFototipi(): Observable<any> {
    return this.http.get<any>(this.api_url + 'phototype/findall')
  }
  getSports(): Observable<any> {
    return this.http.get<any>(this.api_url + 'sport/findall')
  }
  getLavori(): Observable<any> {
    return this.http.get<any>(this.api_url + 'work/findall')
  }
  getAmbienteLavori(): Observable<any> {
    return this.http.get<any>(this.api_url + 'work/environments/findall')
  }
  getEritemi(): Observable<any> {
    return this.http.get<any>(this.api_url + 'erythema/findall')
  }
  getMalattieOculari(): Observable<any> {
    return this.http.get<any>(this.api_url + 'eyediseases/findall')
  }
  getCutiVolto(): Observable<any> {
    return this.http.get<any>(this.api_url + 'careface/findall')
  }
  getPartiDelCorpo(): Observable<any> {
    return this.http.get<any>(this.api_url + 'bodyparts/findall')
  }
  getMalattieCutanee(): Observable<any> {
    return this.http.get<any>(this.api_url + 'skindiseases/findall')
  }
}
