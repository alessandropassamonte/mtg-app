import {
  Directive,
  ElementRef,
  HostListener, Input,
  OnInit
} from "@angular/core";
@Directive({
  selector: '[appFreeDragging]'
})
export class FreeDraggingDirective implements OnInit {





  private isDragging = false;
  private currentX: number | undefined;
  private currentY: number | undefined;
  private initialX: number | undefined;
  private initialY: number | undefined;
  private xOffset = 0;
  private yOffset = 0;

  @Input()
  clickX: any = 0
  @Input()
  clickY: any = 0

  @Input()
  parentTop: any = 0
  @Input()
  parentLeft: any = 0


  moveX = 0
  moveY = 0

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.style.top = this.clickY + 'px';
    this.el.nativeElement.style.left = this.clickX + 'px';
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {

    if (this.el.nativeElement.classList.contains('example-box')) {
      this.isDragging = true;
    }

    this.moveX = (event.target as HTMLElement).getBoundingClientRect().x;
    this.moveY = (event.target as HTMLElement).getBoundingClientRect().y;


    this.initialX = this.clickX
    this.initialY = this.clickY

    this.currentX = this.clickX;
    this.currentY = this.clickY;

    this.xOffset = this.clickX;
    this.yOffset = this.clickY;
  }

  @HostListener('document:mouseup') onMouseUp() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.currentX = (event.clientX - this.parentLeft) -125;
      this.currentY = (event.clientY - this.parentTop) +20;

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      this.el.nativeElement.style.top = (this.currentY +20) + 'px'  ;
      this.el.nativeElement.style.left = (this.currentX - 125 )+ 'px';
    }
  }

}
