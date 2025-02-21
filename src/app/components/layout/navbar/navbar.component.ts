import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent  {


  user: User | null | undefined;

  subscription = new Subscription();

  role: any;

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private ngZone: NgZone) {
    this.subscription.add(this.authService.getUser().subscribe((user: User | null) => this.user = user));
  }
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout()
  }

  linkTo(inputString: string) {
    this.router.navigate([inputString])
  }

}
