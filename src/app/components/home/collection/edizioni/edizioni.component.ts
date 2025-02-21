import { Component } from '@angular/core';
import { Edition } from 'src/app/models/edition';
import { CardDatabaseService } from 'src/app/services/card-database.service';

@Component({
  selector: 'app-edizioni',
  templateUrl: './edizioni.component.html',
  styleUrls: ['./edizioni.component.scss']
})
export class EdizioniComponent {
  editions: Edition[] = [];
  currentPage = 0;
  totalPages = 1;
  isLoading = false;
  selectedEdition: Edition | null = null;

  constructor(private cardDatabaseService: CardDatabaseService) {}

  ngOnInit() {
    this.loadEditions()
  }
  selectSet(edition: Edition) {
    console.log('Set selezionato:', edition);
    this.selectedEdition = edition;
  }

  loadMoreSets(event: any) {
    setTimeout(() => {
      console.log('Altri set caricati');
      event.target.complete();
    }, 1000);
  }

  loadEditions(event?: any) {
    if (this.currentPage >= this.totalPages) {
      if (event) event.target.complete(); // Ferma il caricamento se abbiamo raggiunto l'ultima pagina
      return;
    }

    this.isLoading = true;
    this.cardDatabaseService.getEditions(this.currentPage, 10).subscribe(response => {
      this.editions = [...this.editions, ...response.content]; // ✅ Aggiungiamo nuove edizioni senza sovrascrivere
      this.totalPages = response.totalPages;
      this.currentPage++;
      this.isLoading = false;
      if (event) event.target.complete(); // ✅ Segnala a Ionic che il caricamento è finito
    }, error => {
      console.error('Errore nel recupero delle edizioni', error);
      this.isLoading = false;
    });
  }
}
