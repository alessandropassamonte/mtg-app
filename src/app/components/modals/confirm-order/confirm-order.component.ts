import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/models/card';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { UserCardService } from 'src/app/services/user-card.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent {
  title?: string;
  closeBtnName?: string;
  cardsId: any[] = [];

  confirmForm!: FormGroup


  @Output() event: EventEmitter<any> = new EventEmitter();


  @Input() data!: Order;

  constructor(public bsModalRef: BsModalRef, private orderService: OrderService, private fb: FormBuilder, private toast: ToastrService, private router: Router) {
    this.confirmForm = this.fb.group({
      name: ['', [Validators.required]],
      totalPrice: ['', [Validators.required]],
    })
  }

  ngOnInit() {

    let order: Order = this.data
    if (order.orderItems) {
      order.totalPrice = order.orderItems.reduce((total, item) => {
        if (item.price !== undefined) {
          return total + item.price;
        } else {
          return total;
        }
      }, 0);

      order.totalPriceCardMarket = order.orderItems.reduce((total, item) => {
        if (item.priceCM !== undefined) {
          return total + item.priceCM;
        } else {
          return total;
        }
      }, 0);
    }

    this.confirmForm.patchValue({
      totalPrice: order.totalPrice
    })
  }

  confirm(): void {
    this.salvaOrdine();
  }

  decline(): void {
    this.bsModalRef?.hide();
  }

  salvaOrdine() {
    let order: Order = this.data
    order.name = this.confirmForm.get('name')?.value
    
    this.orderService.save(order).subscribe({
      next: (res: any) => {
        this.event.emit({data: true});
        this.bsModalRef?.hide();
        this.toast.clear()
        this.toast.success('Ordine inserito con successo')
      },
      error: (error) => {
        this.event.emit({data: false});
        this.bsModalRef?.hide();
        this.toast.clear()
        this.toast.warning('Errore durante l\'inserimento')
      }
    })
  }

  navigate() {
    this.router.navigate(['/home/utente/ordini']);
  }

  buildOrder(order: Order): Order {
    let orderBuild: Order = new Order();

    return order;
  }
}
