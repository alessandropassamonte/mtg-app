import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getJsonData(filePath: string): Observable<any> {
    return this.http.get<any>(filePath);
  }

  filterData(data: any[]): any[] {
    return data.filter(item => item.lang === 'en' || item.lang === 'it');
  }

  downloadFilteredData(data: any[], filename: string): void {
    
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'filtered-cards' + '.json';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
