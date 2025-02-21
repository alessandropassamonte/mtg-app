import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Card } from 'src/app/models/card';
import { UserCard } from 'src/app/models/user-card';
import { AuthService } from 'src/app/services/auth.service';
import { UserCardService } from 'src/app/services/user-card.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-carte-possedute',
  templateUrl: './carte-possedute.component.html',
  styleUrls: ['./carte-possedute.component.scss']
})
export class CartePosseduteComponent implements OnInit {

  currentPage = 0;
  itemsPerPage = 12;
  totalItems!: any

  userCards!: UserCard[]; 
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faTrash = faTrash;
  constructor(private authService: AuthService, private router: Router, private userCardService: UserCardService, private datePipe: DatePipe) {
  }


  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.userCardService.getCardByUser(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.userCards = res.content
        this.totalItems = res.totalElements
      }
    })
  }

  returnHtml(image: any) {
    return `<span class="btn-block btn-danger well-sm" > <img src="${image.toString()}" alt="avatar" class="img-fluid" ></span>`
  }
  navigate() {
    this.router.navigate(['/home/utente/carte/aggiungi'])
  }

  pageChanged(event: PageChangedEvent): void {
      this.userCardService.getCardByUser((event.page - 1), event.itemsPerPage).subscribe({
        next: (res: any) => {
          this.userCards = res.content
          this.totalItems = res.totalElements
        }
      })
  }

  changeInVendita(item: UserCard){
    item.inVendita = !(item.inVendita)
    this.userCardService.update(item).subscribe({
      next: (resUpdate: any) => {
        this.loadCards();
      }
      
    })
  }

  changeFoil(item: UserCard){
    item.foil = !(item.foil)
    this.userCardService.update(item).subscribe({
      next: (resUpdate: any) => {
        this.loadCards();
      }
    })
  }

  rimuovi(item: UserCard){
    item.attivo = false
    this.userCardService.update(item).subscribe({
      next: (resUpdate: any) => {
        this.loadCards();
      }
    })
  }
  

}
