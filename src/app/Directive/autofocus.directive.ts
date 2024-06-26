import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  @Input() appAutofocus: boolean = true;
  @Input() delay: number = 1000; 

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.appAutofocus) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, this.delay);
    }
  }
}
