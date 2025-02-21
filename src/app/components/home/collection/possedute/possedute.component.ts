import { Component } from '@angular/core';

@Component({
  selector: 'app-possedute',
  templateUrl: './possedute.component.html',
  styleUrls: ['./possedute.component.scss']
})
export class PosseduteComponent {
  ownedCards = [
    { id: 1, name: 'Black Lotus', set: 'Alpha', image: 'assets/cards/black-lotus.jpg' },
    { id: 2, name: 'Lightning Bolt', set: 'Beta', image: 'assets/cards/lightning-bolt.jpg' },
  ];

  catalogs = [
    { name: 'Standard' },
    { name: 'Commander' },
    { name: 'Modern' }
  ];

  selectedCatalog = 'Standard';

  constructor() {}

  openCard(cardId: number) {
    console.log('Carta selezionata:', cardId);
  }

  loadMoreOwnedCards(event: any) {
    setTimeout(() => {
      console.log('Altre carte possedute caricate');
      event.target.complete();
    }, 1000);
  }
}
