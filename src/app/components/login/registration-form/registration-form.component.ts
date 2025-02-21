import { Component, ElementRef, OnInit, Renderer2, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  configDate = {
    containerClass: 'theme-blue',
    rangeInputFormat: 'DD/MM/YYYY',
    dateInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    showTodayButton: false,
    todayPosition: 'center',

  };

  maxDate = new Date()

  @Output('registrazione')
  registrazioneEmit = new EventEmitter<any>();

  roles: any[] = []

  regexObject = new RegExp('/^(?!=.*[a-z])(?!=.*[A-Z])(?!=.*).{8,20}$/');



  registrazioneForm!: FormGroup

  constructor(private fb: FormBuilder,
    private localeService: BsLocaleService,
    private authService: AuthService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toastr: ToastrService,
    private userService: UserService) {
    this.authService.getAllRoles().subscribe({
      next: (res: any[]) => {
        this.roles = res
      }
    })
    this.localeService.use('it');
  }
  ngOnInit(): void {
    this.registrazioneForm = this.fb.group({
      username: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      ruolo: ['EMPLOYER', Validators.required]
    })




    this.registrazioneForm.valueChanges.subscribe(() => {
      this.checkPasswordStrength();
    });


  }


  registrazione() {
    if (this.registrazioneForm.valid) {
      if (this.passwordsMatch())
        this.authService.registrazione(this.registrazioneForm).subscribe({
          next: (res: any) => {
            this.registrazioneEmit.emit('card-simpletab1')
            this.toastr.success('Registrazione avvenuta con successo. Controllare la mail inserita per confermare la registrazione.')
            this.registrazioneForm = this.fb.group({
              username: ['', [Validators.required]],
              nome: ['', [Validators.required]],
              cognome: ['', [Validators.required]],
              dataNascita: ['', [Validators.required]],
              password: ['', [Validators.required]],
              confirmPassword: ['', [Validators.required]],
              email: ['', [Validators.required, Validators.email]],
              ruolo: ['', [Validators.required]],
            })

          }
        })
      else {
        this.toastr.clear();
        this.toastr.warning('Le password devono essere le uguali', 'Attenzione')
      }

    } else {
      this.toastr.clear();
      this.toastr.warning('Assicurarsi di aver compilato tutti i campi', 'Attenzione')
    }

  }

  passwordsMatch(): boolean {
    const password = this.registrazioneForm.get('password')?.value;
    const confirmPassword = this.registrazioneForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  checkPasswordStrength() {
    const password = this.registrazioneForm.get('password')?.value;
    const strengthMeter = this.elementRef.nativeElement.querySelector('.password-strength-meter');
    const meterValue = this.elementRef.nativeElement.querySelector('.meter-value');
    let strength = 0;
    if (password.match(/[a-zA-Z0-9]+/)) {
      strength += 1;
    }
    if (password.match(/[~<>?]+/)) {
      strength += 1;
    }
    if (password.match(/[!@$%^&*()]+/)) {
      strength += 1;
    }
    switch (strength) {
      case 0:
        this.renderer.setStyle(meterValue, 'width', '0%');
        break;
      case 1:
        this.renderer.setStyle(meterValue, 'width', '33%');
        break;
      case 2:
        this.renderer.setStyle(meterValue, 'width', '66%');
        break;
      case 3:
        this.renderer.setStyle(meterValue, 'width', '100%');
        break;
    }
  }

  getPasswordStrength(): number {
    const password = this.registrazioneForm.get('password')?.value;
    let strength = 0;
    if (password.match(/[a-zA-Z0-9]+/)) {
      strength += 1;
    }
    if (password.match(/[~<>?]+/)) {
      strength += 1;
    }
    if (password.match(/[!@$%^&*()]+/)) {
      strength += 1;
    }
    return (strength / 3) * 100;
  }


  customValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim()) {
      return { customValidation: true };
    }
    return null;
  }





}
