import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  isTab1Active: boolean = false;
  chiusuraFormTab(input: boolean) {
    this.isTab1Active = input;
  }

}
