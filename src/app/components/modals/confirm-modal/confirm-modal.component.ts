import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Card } from 'src/app/models/card';
import { UserCard } from 'src/app/models/user-card';
import { UserCardService } from 'src/app/services/user-card.service';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  title?: string;
  closeBtnName?: string;
  cardsId: any[] = [];
  languages = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'Inglese' },
    { value: 'fr', label: 'Francese' },
    { value: 'pt', label: 'Portoghese' },
    { value: 'ja', label: 'Giapponese' },
    { value: 'ru', label: 'Russo' },
    { value: 'de', label: 'Tedesco' },
    { value: 'es', label: 'Spagnolo' },
    { value: 'ko', label: 'Coreano' },
    { value: 'zhs', label: 'Cinese Semplificato' },
    { value: 'zht', label: 'Cinese Tradizionale' },
    { value: 'fil', label: 'Filipino' },
    { value: 'sa', label: 'Sanscrito' },
    { value: 'grc', label: 'Greco antico' },
    { value: 'he', label: 'Ebraico' },
    { value: 'ar', label: 'Arabo' },
    { value: 'la', label: 'Latino' }
  ];

  confirmForm!: FormGroup


  @Output() event: EventEmitter<any> = new EventEmitter();


  @Input() data: any;

 

  constructor(public bsModalRef: BsModalRef, private userCardService: UserCardService, private fb: FormBuilder, private toast: ToastrService) {
    
    this.confirmForm = this.fb.group({
      attivo: [true, [Validators.required]],
      foil: [false, [Validators.required]],
      inVendita: [false, [Validators.required]],
      lang: ['en', [Validators.required]],
      quantita: [1, [Validators.required]],
    })
  }

  ngOnInit() {
    console.log('data ', this.data)
    if(this.data.aggiuntaSingola){
      this.confirmForm.patchValue({
        lang: this.data.card.lang
      });
    }
  }

  confirm(): void {
    if (this.data.aggiuntaSingola)
      this.aggiungiCartaPosseduta()
    else
      this.aggiungiCarta();


  }

  decline(): void {
    console.log('data 2', this.data)
    this.bsModalRef?.hide();
  }

  aggiungiCarta() {
    let userCard: UserCard = this.buildUSerCard(this.data.card)
    this.userCardService.addCardToUser(userCard).subscribe({
      next: (res: any) => {
        this.event.emit({ data: {} });
        this.bsModalRef?.hide();
        this.toast.clear()
        this.toast.success('Carta aggiunta con successo')
      },
      error: (error) => {
        this.event.emit({ data: { message: 'Errore' } });
        this.bsModalRef?.hide();
        this.toast.clear()
        this.toast.warning('Errore durante l\'inserimento')
      }
    })
  }

  aggiungiCartaPosseduta() {
    let userCard = this.buildUSerCard(this.data.card)
    this.event.emit({ data: userCard });
    this.bsModalRef?.hide();
  }

  buildUSerCard(card: Card): UserCard {
    let userCard: UserCard = new UserCard();
    userCard.card = card
    userCard.foil = this.confirmForm.get('foil')?.value
    userCard.inVendita = this.confirmForm.get('inVendita')?.value
    userCard.attivo = this.confirmForm.get('attivo')?.value
    userCard.lang = this.confirmForm.get('lang')?.value
    userCard.quantita = this.confirmForm.get('quantita')?.value
    return userCard;
  }
}
