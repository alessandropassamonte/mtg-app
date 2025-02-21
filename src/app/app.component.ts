import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private platform: Platform, private location: Location) {}
  ngOnInit(): void {
    // if (this.authService.getToken()) {
    //   this.router.navigate(["/welcome"])
    // }

    this.platform.ready().then(() => {
      App.addListener('backButton', () => {
        if (this.location.path() !== '') {
          this.location.back(); // Torna alla pagina precedente
        } else {
          App.exitApp(); // Esce dall'app se siamo sulla Home
        }
      });
    });
  }

  isFullscreenRoute(): boolean {
    return this.router.url.includes('/scan');
  }



  title = 'mtg-sell-app';
}
