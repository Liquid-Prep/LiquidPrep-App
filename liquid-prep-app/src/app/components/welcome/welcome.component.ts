import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {SwiperComponent} from 'ngx-swiper-wrapper';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})


export class WelcomeComponent implements OnInit {

  private IS_FIRST_START = `first-start`;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject( LOCAL_STORAGE ) private storage: StorageService) { }

  public config: SwiperOptions = {
    a11y: {enabled: true},
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: false,
    autoplay: false,
    speed: 500,
    longSwipesRatio: 0.1,
    longSwipesMs: 100,
    threshold: 5
  };

  @ViewChild(SwiperComponent, { static: false }) swiper?: SwiperComponent;

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

  public onSwiperEvent(event: string): void {
  }

  onSlideNav(direction: string){
    if (direction === 'next'){
      if (this.isLastSlide === true){
        this.onGetStarted();
      }else{
        this.swiper.directiveRef.nextSlide(200);
      }
    }else if (direction === 'back'){
      this.swiper.directiveRef.prevSlide(200);
    }else {
    }
  }
}
