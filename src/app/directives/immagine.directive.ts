import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appImmagine]'
})
export class ImmagineDirective {


  @Input()
  immagine: any

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    const blob = new Blob([this.immagine], { type: 'image/svg+xml'})
    this.el.nativeElement.src = URL.createObjectURL(blob)
  }

}
