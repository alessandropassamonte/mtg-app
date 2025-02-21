import { Component } from '@angular/core';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  activeTab = 'sets'; // Tab predefinito
  sets = [
    { id: 1, name: 'Alpha', year: '1993', image: 'assets/sets/alpha.jpg' },
    { id: 2, name: 'Beta', year: '1993', image: 'assets/sets/beta.jpg' },
    { id: 3, name: 'Unlimited', year: '1993', image: 'assets/sets/unlimited.jpg' },
  ];
  ownedCards = [];
  catalogs = [
    { name: 'Standard' },
    { name: 'Commander' },
    { name: 'Modern' }
  ];
  selectedCatalog = 'Standard';

  constructor() {}

  selectSet(set: any) {
    console.log('Set selezionato:', set);
  }

  loadMoreSets(event: any) {
    setTimeout(() => {
      console.log('Altri set caricati');
      event.target.complete();
    }, 1000);
  }

  loadMoreOwnedCards(event: any) {
    setTimeout(() => {
      console.log('Altre carte possedute caricate');
      event.target.complete();
    }, 1000);
  }

}
