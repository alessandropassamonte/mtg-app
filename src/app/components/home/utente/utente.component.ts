import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { Card } from 'src/app/models/card';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';



@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss']
})
export class UtenteComponent implements OnInit {

  user: any

  faArrowAltCircleRight = faArrowAltCircleRight;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  constructor(private authService: AuthService, private router: Router, private userService: UserService, private datePipe: DatePipe) {
  }

  ngOnInit() {

    this.userService.getUserInSession().subscribe({
      next: (res: any) => {
        this.user= res
      }
    })
  }

  navigate(input: string) {
    this.router.navigate([input])
  }

}
