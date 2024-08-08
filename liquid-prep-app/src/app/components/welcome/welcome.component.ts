import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';

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
  private firstStart = true;

  ngOnInit(): void {
    this.firstStart = this.storage.get(this.IS_FIRST_START);
    if (this.firstStart !== undefined && this.firstStart === false){
      this.router.navigate(['dashboard']).then(r => {});
    }
  }

  ngAfterViewInit(): void {
    const swiperEl = document.querySelector('swiper-container');
    swiperEl.addEventListener('swiperslidechange', (event) => {
      this.curIndex = swiperEl.swiper.activeIndex;
      this.isLastSlide=swiperEl.swiper.isEnd;
      this.isFirstSlide=swiperEl.swiper.isBeginning;
    });
  }

  public onGetStarted(){
    this.router.navigate(['dashboard']).then(r => {});
    this.storage.set(this.IS_FIRST_START, false);
  }

  onSlideNav(direction: string){
    const swiperEl = document.querySelector('swiper-container');
    if (direction === 'next'){
      if(swiperEl.swiper.isEnd){
        this.onGetStarted();
      }else{
        swiperEl.swiper.slideNext(200);
      }
    }else if  (direction === 'back'){
      swiperEl.swiper.slidePrev(200);
    }else {
    }
  }
}
