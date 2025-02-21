import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.scss']
})
export class DettaglioComponent {
  constructor(private route: ActivatedRoute, private cardService: CardService, private router: Router, private modalService: BsModalService) {}


  id!: any;
  card!: Card
  currentImage!: any

  search!: any;
  currentPage!: any;
  itemsPerPage!: any;

  bsModalRef: BsModalRef | undefined;

  faArrowAltCircleLeft = faArrowAltCircleLeft;
  ngOnInit() {
      this.route.params.subscribe(params => {
          this.id = params['id']; 
          this.findByCardId(params['id'])
      });

      this.route.queryParams.subscribe((params: Params) => {
        this.search = params['search'];
        this.currentPage = params['page'];
      });
      
  }


  findByCardId(cardId: any){
    this.cardService.findByCardId(cardId).subscribe({
      next: (res: any) => {
        this.card = res
        this.currentImage = res.png ? res.png : res.imageFace1
      }
    })
  }

  toggleImage() {
    this.currentImage = this.currentImage === this.card.imageFace1 ? this.card.imageFace2 : this.card.imageFace1;
  }


  navigate(){
    const navigationExtras: NavigationExtras = {
      queryParams: { search: this.search , page: this.currentPage, itemsPerPage: this.itemsPerPage }
    };
    this.router.navigate(['/home/ricerca'], navigationExtras);
  }

  confirmModalWithData(item: Card) {
    const initialState = {
      data: {
        card: item,
        aggiuntaSingola: false
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
    this.bsModalRef?.content.event.subscribe((result: any) => {
    })
  }

  
}
