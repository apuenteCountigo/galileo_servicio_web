import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputrestriction]',
})
export class InputRestrictionDirective {
  @Input('inputrestriction') InputRestriction!: string;

  private element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  @HostListener('keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    var regex = new RegExp(this.InputRestriction);
    if (regex.test(event.key)) {
      return true;
    }

    event.preventDefault();
    return false;
  }
}
