import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CardDatabaseService } from 'src/app/services/card-database.service';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent {
  @Input() editionId: string | null = null;
  cards: any[] = [];
  currentPage = 0;
  totalPages = 1;
  isLoading = false;

  constructor(private cardDatabaseService: CardDatabaseService, private router: Router) {}

  ngOnInit() {
    if (this.editionId) {
      this.loadCards();
    }
  }

  goBack() {
    this.editionId = null; // Torna alla selezione delle edizioni
  }

  openCardDetail(cardId: any) {
    this.router.navigate(['/home/card', cardId]); // 🔹 Naviga verso il dettaglio della carta
  }

  loadCards(event?: any) {
    if (!this.editionId || this.currentPage >= this.totalPages) {
      if (event) event.target.complete();
      return;
    }

    this.isLoading = true;
    this.cardDatabaseService.getCardsByEdition( this.currentPage, 10, this.editionId).subscribe(response => {
      this.cards = [...this.cards, ...response.content];
      this.totalPages = response.totalPages;
      this.currentPage++;
      this.isLoading = false;
      if (event) event.target.complete();
    }, error => {
      console.error('Errore nel recupero delle carte', error);
      this.isLoading = false;
    });
  }
}
