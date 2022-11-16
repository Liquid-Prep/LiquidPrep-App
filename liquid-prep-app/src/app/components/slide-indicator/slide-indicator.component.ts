import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';
import { Subscribable } from 'rxjs';

class Indicator {
  constructor(public ref: number) {}
}

@Component({
  selector: 'app-slide-indicator',
  templateUrl: './slide-indicator.component.html',
  styleUrls: ['./slide-indicator.component.scss']
})
export class SlideIndicatorComponent implements OnInit, OnChanges{

  @Input() public current: number;
  @Input() public length: number;
  public indicators: Indicator[] = [];

  public selectedLanguage = 'spanish';
  public text_pos: number[] = [];
  public text_to_trans: string[] = [];
  public translations: string[] = [];

  constructor(private languageService: LanguageTranslatorService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const lengthChanged = changes.length;
    if (lengthChanged){
      for (let i = 0; i < lengthChanged.currentValue; i++) {
        this.indicators.push(new Indicator(i));
      }
    }
    const curChanged = changes.current;
    if (curChanged) {
    }
  }

  public translate() {
    
    var allInBody = document.getElementsByTagName('body')[0];
    var allElements = allInBody.getElementsByTagName('*');
    
    for (var i = 0; i < allElements.length; i++) {
      if (!allElements[i].innerHTML.includes("</") && allElements[i].innerHTML.length != 0) {
        this.text_pos.push(i);
        console.log(i + ": " + allElements[i].innerHTML);
        this.text_to_trans.push(allElements[i].innerHTML);
      }
    }
    this.languageService.getTranslation(this.text_to_trans, this.selectedLanguage).subscribe((response: any) => {
      
      for (i = 0; i < this.text_pos.length; i++) {
        
        setTimeout(() => {  console.log("waiting ..."); }, 1000);
        allElements[this.text_pos[i]].innerHTML = response.translations[i].translation;
        
      }
    });
    
  }

  public getIndicatorClass(ref: number): string {
    if (ref === this.current){
      return 'active';
    }else {
      return 'inactive';
    }
  }

}
