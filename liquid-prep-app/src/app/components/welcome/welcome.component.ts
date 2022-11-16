import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {SwiperComponent} from "ngx-swiper-wrapper";
// import {Translation} from 'src/app/models/Translation';
import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})


export class WelcomeComponent implements OnInit {

  private IS_FIRST_START = `first-start`;

  constructor(
    private router: Router, private languageService: LanguageTranslatorService,
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

  public selectedLanguage = 'spanish';
  public text_pos: number[] = [];
  public text_to_trans: string[] = [];
  public translations: string[] = [];

  private firstStart = true;


  ngOnInit(): void {
    this.firstStart = this.storage.get(this.IS_FIRST_START);
    if (this.firstStart !== undefined && this.firstStart === false){
      this.router.navigate(['my-crops']).then(r => {});
    }
  }

  public onGetStarted(){
    this.router.navigate(['my-crops']).then(r => {});
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
  
  public update_text(translations) {
    var allInBody = document.getElementsByTagName('body')[0];
    var allElements = allInBody.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++) {
      console.log("current trans: " + this.translations[i]);
      allElements[i].innerHTML = this.translations[i];
      console.log("updated text: " + allElements[i].innerHTML);
    }
  }
  public translate(modelID) {
    // let allInBody = document.querySelectorAll('body > *') as NodeListOf<Element>;
    var allInBody = document.getElementsByTagName('body')[0];
    var allElements = allInBody.getElementsByTagName('*');
    
    for (var i = 0; i < allElements.length; i++) {
      if (!allElements[i].innerHTML.includes("</") && allElements[i].innerHTML.length != 0) {
        this.text_pos.push(i);
        console.log(i + ": " + allElements[i].innerHTML);
        this.text_to_trans.push(allElements[i].innerHTML.toLowerCase());
      }
    }
    this.languageService.getTranslation(this.text_to_trans, modelID).subscribe((response: any) => {
      
      for (i = 0; i < this.text_pos.length; i++) {
        //console.log(allElements[this.text_pos[i]].innerHTML);
        // setTimeout(() => {  console.log("waiting ..."); }, 2000);
        allElements[this.text_pos[i]].innerHTML = response.translations[i].translation;
        
      }
    });
    
  }

  // updateTranslation() {
  //   this.languageService.getTranslation(this.translations, this.selectedLanguage).subscribe((response: any) => {
  //      this.today = (response.translations[0].translation);
  //      this.addYourCrop = (response.translations[1].translation);
  //      this.selectOption = (response.translations[2].translation);
  //      this.add = (response.translations[3].translation);
  //     });
  //     // don't know how to make date into string
  //   this.languageService.getTranslation("November 16, 2022", this.selectedLanguage).subscribe((response: any) => {
  //      this.translation = (response.translations[0].translation);
  //      this.currentDate = (this.translation);
  //     });
  // }

  


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
