import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/envioronment/environment';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }

  api_url = environment.api_url + 'orders/'

  getOrdersByUser(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.http.get<any>(this.api_url + 'all', { params: params })
  }

  save(order: Order): Observable<any> {
    return this.http.post<any>(this.api_url + 'save', order)
  }

  deleteById(orderId: any): Observable<any> {
    let params = new HttpParams()
      .set('orderId', orderId)
    return this.http.delete<any>(this.api_url + 'delete', { params: params })
  }

}
