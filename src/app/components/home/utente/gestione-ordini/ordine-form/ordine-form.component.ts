import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, OperatorFunction, Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ConfirmItemComponent } from 'src/app/components/modals/confirm-item/confirm-item.component';
import { ConfirmOrderComponent } from 'src/app/components/modals/confirm-order/confirm-order.component';
import { Card } from 'src/app/models/card';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/order-item';
import { CardService } from 'src/app/services/card.service';
import { UserCardService } from 'src/app/services/user-card.service';

@Component({
  selector: 'app-ordine-form',
  templateUrl: './ordine-form.component.html',
  styleUrls: ['./ordine-form.component.scss']
})
export class OrdineFormComponent {
  cards: Card[] = [];
  searchValue!: string;
  selected?: string;
  errorMessage: string = '';

  selectedItems: OrderItem[] = []
  bsModalRef: BsModalRef | undefined;
  bsModalRefItem: BsModalRef | undefined;

  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faTrash = faTrash;

  private searchSubject = new Subject<string>();
  readOnly = false;


  @ViewChild('card')
  insideElementProf!: ElementRef;



  constructor(private userCardService: UserCardService, private modalService: BsModalService,private renderer: Renderer2, private router: Router, private route: ActivatedRoute, @Inject(DOCUMENT) private document: any) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.insideElementProf && e.target !== this.insideElementProf.nativeElement && !(<Element>e.target).classList.contains('ngx-spinner-overlay')) {
        this.closeCards();
      }
    })

    this.selectedItems = this.router.getCurrentNavigation()?.extras.state?.['orderItems'];
    this.readOnly = this.router.getCurrentNavigation()?.extras.state?.['readOnly'];

    this.searchSubject.pipe(
      debounceTime(1000),
      switchMap((term: string) => {
        if (term.length >= 3) {
          return this.userCardService.searchAutocomplete(term).pipe(
            catchError(err => {
              this.errorMessage = err.message || 'Something goes wrong';
              return of([]);
            })
          );
        } else {
          return of([]);
        }
      })
    ).subscribe((data: any[]) => {
      this.cards = data;
    });
  }

  closeCards(){
    this.searchValue = ''
    this.cards = []
  }

  loadCards(): void {
    this.searchSubject.next(this.searchValue);
  }


  returnHtml(image: any) {
    return `<span class="btn-block btn-danger well-sm" > <img src="${image.toString()}" alt="avatar" class="img-fluid" ></span>`
  }

  addItem(item: Card): void {
    let orderItem: OrderItem = new OrderItem;
    orderItem.card = item
    const initialState = {
      data: orderItem
    };
    this.bsModalRefItem = this.modalService.show(ConfirmItemComponent, { initialState });
    this.bsModalRefItem?.content.event.subscribe((result: any) => {
      this.selectedItems.push(result.data);
    })
  }

  salvaOrdine() {
    let order: Order = new Order()
    order.orderItems = this.selectedItems
    const initialState = {
      data: order
    };
    this.bsModalRef = this.modalService.show(ConfirmOrderComponent, { initialState });
    this.bsModalRef?.content.event.subscribe((result: any) => {
      if(result.data){
        this.navigate()
      }
    })
  }

  navigate() {
    this.router.navigate(['/home/utente/ordini']);
  }

  getPrice(item: any) {
      return item.quantity > 1 ? (item.price / item.quantity) : item.price
  }

  getPriceCM(item: any) {
    return item.quantity > 1 ? (item.priceCM / item.quantity) : item.priceCM
}


  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
  }





}
