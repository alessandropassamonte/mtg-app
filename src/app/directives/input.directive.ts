import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[appInputRestriction]'
})
export class InputDirective {

  inputElement: ElementRef;

  @Input('appInputRestriction') appInputRestriction: string | undefined;
  arabicRegex = '[\u0600-\u06FF]';

  constructor(el: ElementRef, private toastrService: ToastrService) {
    this.inputElement = el;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (this.appInputRestriction === 'integer') {
      this.integerOnly(event);
    } else if (this.appInputRestriction === 'noSpecialChars') {
      this.noSpecialChars(event);
    }
    else if (this.appInputRestriction === 'noSpecialCharsNoNumb') {
      this.noSpecialCharsNoNumb(event);
    }

    else if (this.appInputRestriction === 'dateOnly') {
      this.dateOnly(event);
    }
    else if (this.appInputRestriction === 'lettersOnly') {
      this.lettersOnly(event);
    }
   
    else if (this.appInputRestriction === 'priceOnly') {
      this.priceOnly(event);
    }
    else if (this.appInputRestriction === 'lettersAndNumbersOnly') {
      this.lettersAndNumbersOnly(event);
    }
    else if (this.appInputRestriction === 'nothing') {
      this.nothing(event);
    }
    else if (this.appInputRestriction === 'lettersAndAnySpecialChars') {
      this.lettersAndAnySpecialChars(event);
    }
    else if (this.appInputRestriction === 'lettersAndNumberAndAnySpecialChars') {
      this.lettersAndNumberAndAnySpecialChars(event);
    }
    else if (this.appInputRestriction === 'lettersAndNumberAndAnyUnderscore') {
      this.lettersAndNumberAndAnyUnderscore(event);
    }
    else if (this.appInputRestriction === 'urlOnly') {
      this.urlOnly(event);
    }
  }

  integerOnly(event: any) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
      e.preventDefault();
    }
  }


  noSpecialChars(event: any) {
    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^0-9a-zA-Zàèòìùé\.\*\\,/\():\[\]= &']/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }
    e.preventDefault();
  }



  lettersAndNumbersOnly(event: any) {
    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^0-9a-zA-Zàèòìùé]/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }
    e.preventDefault();
  }

  noSpecialCharsNoNumb(event: any) {
    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^a-zA-Zàèòìùé\.\- ']/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }
    e.preventDefault();
  }

  lettersOnly(event: any) {
    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^a-zA-Z]/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }
    e.preventDefault();
  }

  
  nothing(event: any) {
    const e = <KeyboardEvent>event;
    const patt = new RegExp('^$')
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }
    e.preventDefault();
  }



  priceOnly(event: any) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ','].indexOf(e.key) === -1) {
      e.preventDefault();
    }
  }

  dateOnly(event: any) {
    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^0-9/]/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }
    e.preventDefault();
  }

  lettersAndAnySpecialChars(event: any) {

    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^a-zA-Z \-_\.\/\\\\]/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }

    e.preventDefault();
  }

  lettersAndNumberAndAnySpecialChars(event: any) {

    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^0-9a-zA-Zàèòìùé \-_\.\/\\\\]/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }

    e.preventDefault();
  }

  lettersAndNumberAndAnyUnderscore(event: any) {

    const e = <KeyboardEvent>event;
    const patt = new RegExp(/[^0-9a-zA-Zàèòìùé \-_]/g)
    let x = (event.key).toString()

    if (!patt.test(x)) {
      return;
    }

    e.preventDefault();
  }

  urlOnly(event: any) {
    const e = <KeyboardEvent>event;
    const patt = new RegExp(/^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=]+$/g)
    let x = (event.key).toString()

    if (patt.test(x)) {
      return;
    }

    e.preventDefault();
  }



  @HostListener('paste', ['$event']) onPaste(event: any) {
    let regex;
    switch (this.appInputRestriction) {
      case 'integer':
        regex = /^\d+$/;
        break;
      case 'noSpecialChars':
        regex = /^[0-9a-zA-Zàèòìùé\.\*\\,/\():\[\]= &']+$/;
        break;
      case 'noSpecialCharsNoNumb':
        regex = /^[a-zA-Zàèòìùé\.\- ]+$/;
        break;
      case 'elemInfoChars':
        regex = /^[a-zA-ZÀ-ÖØ-öø-ÿž0-9 '°^.,():-]+$/;
        break;
      case 'dateOnly':
        regex = /^[0-9/]+$/;
        break;
      case 'lettersOnly':
        regex = /^[a-zA-Z]+$/;
        break;
      case 'coordinates':
        regex = /^-?\d{1,2}(\.\d{1,6})?$/;
        break;
      case 'priceOnly':
        regex = /^\d+(,\d+)?$/;
        break;
      case 'lettersAndNumbersOnly':
        regex = /^[0-9a-zA-Zàèòìùé]+$/;
        break;
      case 'lettersAndAnySpecialChars':
        regex = /^[a-zA-Z\-_\.\/\\\\]+$/;
        break;
      case 'lettersAndNumberAndAnySpecialChars':
        regex = /^[0-9a-zA-Zàèòìùé\-_\.\/\\\\]+$/;
        break;
      case 'lettersAndNumberAndAnyUnderscore':
        regex = /^[0-9a-zA-Zàèòìùé \-_]+$/;
        break;
      case 'urlOnly':
        regex = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=]+$/
        break;

      default:
        return;
    }
    let pasteData = ''
    if (this.appInputRestriction != 'urlOnly') {
      pasteData = event.clipboardData.getData('text/plain');
    } else {
      pasteData = event.clipboardData.getData('text')
    }
    if (!regex.test(pasteData)) {
      event.preventDefault();
      this.toastrService.clear();
      this.toastrService.info('Stai provando ad incollare una stringa con dei caratteri non ammessi', 'Attenzione')
    }

  }


}
