import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';

@Injectable({
  providedIn: 'root'
})
export class AnamnesiService {

  constructor(private http: HttpClient) { }

  api_url = environment.api_url + 'anamnesi/'


  getByUsername(): Observable<any> {
    return this.http.get<any>(this.api_url + 'retrieve')
  }
  save(inputForm: any): Observable<any> {
    let body = this.createBody(inputForm)
    return this.http.post<any>(this.api_url + 'save', body)
  }

  createBody(inputForm: any) {
    
    // if (inputForm?.bodyParts) {
    //   inputForm.bodyParts = inputForm.bodyParts.map((id: any) => ({ id: id }));
    // }
    // if (inputForm?.skinDiseases) {
    //   inputForm.skinDiseases = inputForm.skinDiseases.map((id: any) => ({ id: id }));
    // }
    // if (inputForm?.erythemas) {
    //   inputForm.erythemas = inputForm.erythemas.map((id: any) => ({ id: id }));
    // }
    // if (inputForm?.careFaces) {
    //   inputForm.careFaces = inputForm.careFaces.map((id: any) => ({ id: id }));
    // }
    inputForm.anamnesiEyeDiseases = [];
    if (inputForm?.patologieOculari) {
      if (inputForm?.patologieOculari?.destro) {
        inputForm?.patologieOculari?.destro.forEach((element: any) => {
          inputForm.anamnesiEyeDiseases.push({
            eye: 'DX',
            eyeDiseases: element
          });
        });
      }
      if (inputForm?.patologieOculari?.sinistro) {
        inputForm?.patologieOculari?.sinistro.forEach((element: any) => {
          inputForm.anamnesiEyeDiseases.push({
            eye: 'SX',
            eyeDiseases: element
          });
        });
      }
    }
    return inputForm;
  }


}
