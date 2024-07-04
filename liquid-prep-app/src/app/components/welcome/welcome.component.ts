import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import Swiper from "swiper";
import SwiperOptions from "swiper"

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit,AfterViewInit{
  private IS_FIRST_START = `first-start`;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject( LOCAL_STORAGE ) private storage: StorageService) { }

  public curIndex = 0;
  public isFirstSlide = true;
  public isLastSlide = false;
  public disabled = false;
  private firstStart = true;


  ngOnInit(): void {
    this.firstStart = this.storage.get(this.IS_FIRST_START);
    if (this.firstStart !== undefined && this.firstStart === false){
      this.router.navigate(['dashboard']).then(r => {});
    }
  }

  ngAfterViewInit(): void {
    const swiperOptions: SwiperOptions = {
      a11y: true,
      speed: 500,
      direction: 'horizontal',
      on: {
        init: () => {
          console.log('on Swiper initialized');
        },
        slideNextTransitionEnd: () => {
          this.onIndexChange(swiper.realIndex);
          console.log('on slideNextTransitionEnd', swiper.realIndex);
        },
        slidePrevTransitionEnd: () => {
          this.onIndexChange(swiper.realIndex);
          console.log('on slidePrevTransitionEnd', swiper.realIndex);
        }
      }
    };
    const swiper = new Swiper('swiper-container',swiperOptions);
  }

  public onGetStarted(){
    this.router.navigate(['dashboard']).then(r => {});
    this.storage.set(this.IS_FIRST_START, false);
  }

  public onIndexChange(index: number): void {

    this.curIndex = index;
    if (index === 0 ){
      this.isFirstSlide = true;
      this.isLastSlide = false;
    }else if (index === 2){
      this.isFirstSlide = false;
      this.isLastSlide = true;
    }else{
      this.isFirstSlide = false;
      this.isLastSlide = false;
    }
  }

  onSlideNav(direction: string){
    const swiperEl = document.querySelector('swiper-container');
    if (direction === 'next'){
      if (this.isLastSlide === true){
        this.onGetStarted();
      }else{
        // this.swiper.directiveRef.nextSlide(200);
        swiperEl.swiper.slideNext(200);
      }
    }else if (direction === 'back'){
      // this.swiper.directiveRef.prevSlide(200);
      swiperEl.swiper.slidePrev(200);
    }else {
    }
    console.log('onSlideNav swiperEl',swiperEl.swiper.realIndex);
  }
}
