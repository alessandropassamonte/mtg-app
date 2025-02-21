import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInLeft, slideOutRight } from 'ng-animate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
        this.tabAttivo = params['tabAttivoPassed'] ? params['tabAttivoPassed'] : 'card-simpletab1';
    });
  }


  registrazioneForm!: FormGroup

  tabAttivo: string = '';
  activeTab = 'login';


  ngOnInit(): void {
    this.registrazioneForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      keepConnection: [false, [Validators.required]],
    })
    if (this.authService.getToken()) {
      this.router.navigate(['home']);
    }
  }





  selectedTab: string | undefined


  isTab1Active: boolean = false;

  slide = trigger('slide', [
    transition(':enter', useAnimation(slideInLeft)),
    transition(':leave', useAnimation(slideOutRight)),
  ]);


  ordinamentoIsSelect(): boolean {
    return this.selectedTab === 'card-simpletab2'
  }


  chiusuraFormTab(input: boolean) {
    this.isTab1Active = input;
  }

  cambiaTab(tabId: string) {
    this.tabAttivo = tabId;
  }

}
