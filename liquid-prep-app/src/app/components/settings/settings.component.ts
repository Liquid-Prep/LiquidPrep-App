import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public selectedLanguage = 'spanish';
  public text_pos: number[] = [];
  public text_to_trans: string[] = [];
  public translations: string[] = [];

  constructor(private router: Router, private location: Location, private languageService: LanguageTranslatorService) { }

  ngOnInit(): void {
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

  public volumeClicked() {
    this.router.navigateByUrl('/my-crops');
  }

  public backClicked() {
    this.location.back();
  }

}
