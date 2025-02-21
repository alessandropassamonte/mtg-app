import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent {

  productId!: string;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.authService.activateUser(params.get('token')).subscribe({
        next: (res: any) => {
        }
      })
    });
  }
}
