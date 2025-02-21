import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft, faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, debounceTime, of, switchMap } from 'rxjs';
import { ConfirmCardsPosseduteComponent } from 'src/app/components/modals/confirm-cards-possedute/confirm-cards-possedute.component';
import { ConfirmItemComponent } from 'src/app/components/modals/confirm-item/confirm-item.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { ConfirmStandardComponent } from 'src/app/components/modals/confirm-standard/confirm-standard.component';
import { Card } from 'src/app/models/card';
import { OrderItem } from 'src/app/models/order-item';
import { UserCard } from 'src/app/models/user-card';
import { CardService } from 'src/app/services/card.service';
import { UserCardService } from 'src/app/services/user-card.service';

@Component({
  selector: 'app-carte-possedute-form',
  templateUrl: './carte-possedute-form.component.html',
  styleUrls: ['./carte-possedute-form.component.scss']
})
export class CartePosseduteFormComponent {

  cards: Card[] = [];
  searchValue!: string;
  selected?: string;
  errorMessage: string = '';

  selectedItems: UserCard[] = []
  bsModalRef: BsModalRef | undefined;
  bsModalRefItem: BsModalRef | undefined;

  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faCamera = faCamera;
  faTrash = faTrash;

  private searchSubject = new Subject<string>();
  readOnly = false;


  @ViewChild('card')
  insideElementProf!: ElementRef;



  constructor(private cardService: CardService, private userCardService: UserCardService, private modalService: BsModalService,private renderer: Renderer2, private router: Router, private route: ActivatedRoute, @Inject(DOCUMENT) private document: any,private toast: ToastrService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.insideElementProf && e.target !== this.insideElementProf.nativeElement && !(<Element>e.target).classList.contains('ngx-spinner-overlay')) {
        this.closeCards();
      }
    })

    this.searchSubject.pipe(
      debounceTime(1000),
      switchMap((term: string) => {
        if (term.length >= 3) {
          return this.cardService.searchAutocomplete(term).pipe(
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
    const initialState = {
      data: {
        card: item,
        aggiuntaSingola: true
      }
    };
    this.bsModalRefItem = this.modalService.show(ConfirmModalComponent, { initialState });
    this.bsModalRefItem?.content.event.subscribe((result: any) => {
      console.log('RESULT  ', result.data)
      this.selectedItems.push(result.data);
    })
  }

  salvaCards() {
    const initialState = {
      data: {
        title: 'Aggiungi Carte',
        domanda: 'Sei sicuro di aggiungere queste carte?'
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmStandardComponent, { initialState });
    this.bsModalRef?.content.event.subscribe((result: any) => {
      if (result.data) {
        this.userCardService.addAllToUser(this.selectedItems).subscribe({
          next: (res: any) => {
            this.toast.clear()
            this.toast.success('Carte inserite con successo')
            this.selectedItems = []
          }
        })
      }
    })
  }

  navigate() {
    this.router.navigate(['/home/utente/carte']);
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
