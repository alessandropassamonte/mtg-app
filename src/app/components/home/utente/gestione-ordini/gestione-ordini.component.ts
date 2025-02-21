import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationExtras, Route, Router } from '@angular/router';
import { faArrowAltCircleLeft, faInfoCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer, Subject, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { ConfirmStandardComponent } from 'src/app/components/modals/confirm-standard/confirm-standard.component';
import { Card } from 'src/app/models/card';
import { Order } from 'src/app/models/order';
import { CardService } from 'src/app/services/card.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-gestione-ordini',
  templateUrl: './gestione-ordini.component.html',
  styleUrls: ['./gestione-ordini.component.scss']
})
export class GestioneOrdiniComponent implements OnInit {
  currentPage = 0;
  itemsPerPage = 12;
  totalItems!: any

  orders!: Order[];

  bsModalRef!: BsModalRef
  faInfoCircle = faInfoCircle;

  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faTrash = faTrash;
  constructor(private orderService: OrderService, private router: Router, private datePipe: DatePipe, private toast: ToastrService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders() {
    this.orderService.getOrdersByUser(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.orders = res.content
        this.totalItems = res.totalElements
      }
    })
  }

  navigate(order?: Order) {
    if (order) {
      const navigationExtras: NavigationExtras = {
        state: {
          orderItems: order.orderItems,
          readOnly: true
        }
      }
      this.router.navigate(['/home/utente/ordini/form'], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        state: {
          orderItems: [],
          readOnly: false
        }
      }
      this.router.navigate(['/home/utente/ordini/form'], navigationExtras);
    }

  }

  pageChanged(event: PageChangedEvent): void {
    this.orderService.getOrdersByUser((event.page - 1), event.itemsPerPage).subscribe({
      next: (res: any) => {
        this.orders = res.content
        this.orders.map(item => ({
          ...item,
          orderDate: this.datePipe.transform(item.orderDate, 'dd/MM/yyyy')
        }))
        this.totalItems = res.totalElements
      }
    })
  }

  getDate(date: any) {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm')
  }

  delete(order: Order) {
    if (order) {
      const initialState = {
        data: {
          title: 'Rimuovi Ordine',
          domanda: 'Sei sicuro di vore rimuovere questo Ordine?'
        }
      };
      this.bsModalRef = this.modalService.show(ConfirmStandardComponent, { initialState });
      this.bsModalRef?.content.event.subscribe((result: any) => {
        if (result.data) {
          this.orderService.deleteById(order.id).subscribe({
            next: (res: any) => {
              this.loadOrders()
              this.toast.clear()
              this.toast.success('Ordine rimosso con successo')
            }
          })
        }
      })
    }

  }

}
