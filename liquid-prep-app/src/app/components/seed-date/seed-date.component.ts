import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Crop, Stage } from '../../models/Crop';
import { CropDataService } from 'src/app/service/CropDataService';
import { DateTimeUtil } from 'src/app/utility/DateTimeUtil';

import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'app-seed-date',
  templateUrl: './seed-date.component.html',
  styleUrls: ['./seed-date.component.scss']
})
export class SeedDateComponent implements OnInit {
  crop: Crop;
  stages: Stage[];
  userSelectiondate: Date;
  maxDate = new Date();

  constructor(
    private router: Router, private languageService: LanguageTranslatorService,
    private location: Location,
    private route: ActivatedRoute,
    private cropService: CropDataService
  ) {
    this.userSelectiondate = new Date();
  }

  public selectedLanguage = 'spanish';
  public text_pos: number[] = [];
  public text_to_trans: string[] = [];
  public translations: string[] = [];

  ngOnInit(): void {
    const cropId = this.route.snapshot.paramMap.get('id');
    this.cropService.getCropData(cropId)
      .subscribe(
        (cropData) => {
          this.crop = cropData;
          this.stages = cropData.cropGrowthStage.stages;
        },
        (err) => {
          alert('Could not get crop info: ' + err);
        }
    );
  }
  
  public translate(modelID) {
    
    var allInBody = document.getElementsByTagName('body')[0];
    var allElements = allInBody.getElementsByTagName('*');
    
    for (var i = 0; i < allElements.length; i++) {
      if (!allElements[i].innerHTML.includes("</") && allElements[i].innerHTML.length != 0) {
        this.text_pos.push(i);
        console.log(i + ": " + allElements[i].innerHTML);
        this.text_to_trans.push(allElements[i].innerHTML);
      }
    }
    this.languageService.getTranslation(this.text_to_trans, modelID).subscribe((response: any) => {
      
      for (i = 0; i < this.text_pos.length; i++) {
        
        setTimeout(() => {  console.log("waiting ..."); }, 1000);
        allElements[this.text_pos[i]].innerHTML = response.translations[i].translation;
        
      }
    });
    
  }

  public volumeClicked() {

  }

  public backClicked() {
    this.location.back();
  }

  clickConfirm(userSelectedDate: Date) {

    const todayDate = new DateTimeUtil().getTodayDate();
    const numberOfDaysFromSeedingDate = Math.floor((Math.abs(todayDate.getTime() - userSelectedDate.getTime())) / (1000 * 3600 * 24));

    // identify the current crop growth stage based on the number days of seeding date
    const stage: Stage = this.identifyGrowthStage(numberOfDaysFromSeedingDate);

    // add crop info to my crops list
    this.crop.seedingDate = userSelectedDate;
    this.cropService.storeMyCropsInLocalStorage(this.crop);
    // store selected crop id in session to generate water advise
    this.cropService.storeSelectedCropIdInSession(this.crop.id);

    this.router.navigate(['/measure-soil/' + this.crop.id]).then(r => {});
  }

  // @desc  Identify the current crop growth stage based on the number of days from the seeding date
  // @param numberOfDaysFromSeedingDate
  // @return The current crop growth stage
  private identifyGrowthStage(numberOfDaysFromSeedingDate) {
    let stage: Stage;
    const cummulativeStagesLength: number[] = [this.stages[0].stageLength];
    for (let i = 1; i < this.stages.length; i++){
      cummulativeStagesLength[i] = cummulativeStagesLength[i - 1] + this.stages[i].stageLength;
    }
    for (let i = 0; i < this.stages.length; i++){
      if (numberOfDaysFromSeedingDate <= cummulativeStagesLength[i]){
        stage = this.stages[i];
        break;
      } else {
        stage = this.stages[i];
      }
    }
    return stage;
  }

}
