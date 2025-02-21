import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { albumsOutline, cameraOutline, logoIonic } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular';
import * as Parser from 'rss-parser';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {


  rssFeeds=  [
    {
      name: "MTGGoldfish",
      url: "https://www.mtggoldfish.com/feed"
    },
    {
      name: "Draftsim Blog",
      url: "https://draftsim.com/feed"
    },
    {
      name: "Card Kingdom Blog",
      url: "https://blog.cardkingdom.com/feed"
    },
    {
      name: "EDHREC",
      url: "https://edhrec.com/articles/feed"
    },
    {
      name: "Star City Games",
      url: "https://articles.starcitygames.com/feed"
    },
    {
      name: "MTG Price Blog",
      url: "https://blog.mtgprice.com/feed"
    },
    {
      name: "MTG Arena Zone News",
      url: "https://mtgazone.com/feed"
    },
    {
      name: "MTG Arena Pro Blog",
      url: "https://mtgarena.pro/feed"
    },
    {
      name: "MTGStocks News",
      url: "https://api.mtgstocks.com/news/feed"
    },
    {
      name: "Quiet Speculation",
      url: "https://quietspeculation.com/feed"
    },
    {
      name: "Face To Face Games » Magic",
      url: "https://magic.facetofacegames.com/feed"
    },
    {
      name: "Cranial Insertion",
      url: "https://cranial-insertion.com/feed"
    },
    {
      name: "My Weekly Grind",
      url: "https://myweeklygrind.com/feed"
    },
    {
      name: "Wizards",
      url: "https://magic.wizards.com/en/articles/feed"
    },
    {
      name: "Toracles",
      url: "https://toracles.com/feed"
    },
    {
      name: "Magic Card Investor",
      url: "https://magiccardinvestor.com/feed"
    },
    {
      name: "Channel Fireball » Magic",
      url: "https://strategy.channelfireball.com/feed"
    },
    {
      name: "Cardsphere Blog",
      url: "https://blog.cardsphere.com/feed"
    },
    {
      name: "MTG Meta",
      url: "https://mtgmeta.io/articles/feed"
    },
    {
      name: "Commander's Herald",
      url: "https://commandersherald.com/feed"
    },
    {
      name: "Multiverse in Review",
      url: "https://multiverseinreview.com/feed"
    }
  ];
  selectedFeed = this.rssFeeds[3].url;
  articles: any[] = [];

  recentCards = [
    { id: 1, name: 'Black Lotus', type: 'Artifact', image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg' },
    { id: 2, name: 'Lightning Bolt', type: 'Instant', image: 'https://cards.scryfall.io/large/front/c/c/ccee0b4c-0cb0-4c0f-8ddc-bc74b8b97273.jpg?1592765716' },
    { id: 3, name: 'Dark Ritual', type: 'Instant', image: 'https://cards.scryfall.io/large/front/9/5/95f27eeb-6f14-4db3-adb9-9be5ed76b34b.jpg?1628801678' }
  ];

  proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url='; // Proxy RSS

  constructor(private router: Router, private http: HttpClient) {
    addIcons({ logoIonic, albumsOutline, cameraOutline });
  }

  ngOnInit() {
    this.loadFeed()
  }

  searchCards(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for:', query);
  }

  openCard(cardId: number) {
    this.router.navigate(['/card', cardId]);
  }

  loadFeed() {
    const url = this.proxyUrl + encodeURIComponent(this.selectedFeed) + "%2F";
    
    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    // const url = proxy + this.selectedFeed;
    this.http.get(url).subscribe(
      (data: any) => {
        if (data.status === 'ok') {
          this.articles = data.items.map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail: item.thumbnail
          }));
        } else {
          console.error('Errore nel parsing del feed RSS');
        }
      },
      error => {
        console.error('Errore nel caricamento del feed:', error);
      }
    );
  }

  openArticle(url: string) {
    window.open(url, '_blank');
  }



}
