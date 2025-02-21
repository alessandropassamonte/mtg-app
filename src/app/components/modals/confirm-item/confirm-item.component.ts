import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/order-item';
import { CardService } from 'src/app/services/card.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-confirm-item',
  templateUrl: './confirm-item.component.html',
  styleUrls: ['./confirm-item.component.scss']
})
export class ConfirmItemComponent {
  title?: string;
  closeBtnName?: string;
  cardsId: any[] = [];

  confirmForm!: FormGroup


  @Output() event: EventEmitter<any> = new EventEmitter();


  @Input() data!: OrderItem;


  constructor(public bsModalRef: BsModalRef, private orderService: OrderService, private fb: FormBuilder, private toast: ToastrService, private cardService: CardService) {
    this.confirmForm = this.fb.group({
      price: [0, [Validators.required]],
      quantity: [1, [Validators.required]],
      foil: [false, [Validators.required]],
    })
  }

  ngOnInit() {
  }

  confirm(): void {
    this.aggiungiOrdine();
  }

  decline(): void {
    this.bsModalRef?.hide();
  }

  aggiungiOrdine() {
    let orderItem: OrderItem = this.data
    orderItem.price = this.confirmForm.get('price')?.value * this.confirmForm.get('quantity')?.value
    orderItem.quantity = this.confirmForm.get('quantity')?.value
    orderItem.foil = this.confirmForm.get('foil')?.value

    if (orderItem.card) {
      this.cardService.getPrice(orderItem.card).subscribe({
        next: (res: any) => {
          if (res.price && res.price !== '') {
            const str = res.price;
            const numStr = str.replace(/€|,/g, '.');
            let pric = parseFloat(numStr.replace(/,/g, '.'))  
            console.log('PRICE ', pric)
            orderItem.priceCM = pric * this.confirmForm.get('quantity')?.value;
          } else {
            orderItem.priceCM = 0;
          }
          this.event.emit({ data: orderItem });
          this.bsModalRef?.hide();
          this.toast.clear()
          this.toast.success('Carta aggiunta con successo')
        }, error: (err: any) => {
          this.toast.clear()
          this.toast.error('Errore')
        }
      });
    }


  }


}
