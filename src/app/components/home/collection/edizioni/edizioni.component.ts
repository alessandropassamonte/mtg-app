import { Component } from '@angular/core';
import { Edition } from 'src/app/models/edition';
import { EditionService } from 'src/app/services/edition.service';

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

  constructor(private editionService: EditionService) {}

  ngOnInit() {
    this.loadEditions()
  }
  selectSet(set: any) {
    console.log('Set selezionato:', set);
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
    this.editionService.getEditions(this.currentPage, 10).subscribe(response => {
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
