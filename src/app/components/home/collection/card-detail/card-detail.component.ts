import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardDatabaseService } from 'src/app/services/card-database.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent {
  card: any | null = null;
  cardVersions: any[] = [];
  cardPrices: any[] = [];
  activeTab: 'versions' | 'ruling' = 'versions';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardDatabaseService: CardDatabaseService
  ) {}

  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.loadCardDetails(+cardId);
    }
  }

  loadCardDetails(cardId: any) {
    this.isLoading = true;
    this.cardDatabaseService.getCardDetails(cardId).subscribe(response => {
      this.card = response;
      this.isLoading = false;
    });

    this.cardDatabaseService.getCardVersions(cardId).subscribe(response => {
      this.cardVersions = response;
    });

    this.cardDatabaseService.getCardPrices(cardId).subscribe(response => {
      this.cardPrices = response;
    });
  }

  goBack() {
    this.router.navigate(['/home/collection']);
  }

  setTab(tab: 'versions' | 'ruling') {
    this.activeTab = tab;
  }

}
