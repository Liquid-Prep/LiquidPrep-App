import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import SwiperOptions  from 'swiper';


@Directive({
  selector: '[appSwiper]'
})
export class SwiperDirectiveDirective implements AfterViewInit{

  @Input() config?: SwiperOptions;

  constructor(private el: ElementRef<SwiperContainer>) { }

  ngAfterViewInit(): void {
    console.log('SwiperDirective', this.config, this.el.nativeElement);
    Object.assign(this.el.nativeElement, this.config);
    this.el.nativeElement.initialize();
  }
}
