import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Crop } from '../../models/Crop';
import { CropDataService } from 'src/app/service/CropDataService';
import { DateTimeUtil } from 'src/app/utility/DateTimeUtil';
import { HeaderService } from 'src/app/service/header.service';
import {CropInfoResp, PlantGrowthStage} from '../../models/api/CropInfoResp';

@Component({
  selector: 'app-seed-date',
  templateUrl: './seed-date.component.html',
  styleUrls: ['./seed-date.component.scss'],
})
export class SeedDateComponent implements OnInit {
  crop: Crop = new Crop();
  userSelectiondate: Date;
  maxDate = new Date();

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private cropService: CropDataService,
    private headerService: HeaderService
  ) {
    this.userSelectiondate = new Date();
  }

  ngOnInit(): void {
    const cropId = this.route.snapshot.paramMap.get('id');
    this.cropService.getCropInfo(cropId).subscribe(
      (resp: CropInfoResp) => {
        this.crop.id = resp.data.docs[0]._id;
        this.crop.cropName = resp.data.docs[0].cropName;
        this.crop.facts = resp.data.docs[0];
      },
      (error) => {
        alert('Could not get crop info: ' + error);
        console.error('Error getting CropInfo:', error);
      }
    );
    this.headerService.updateHeader(
      'Select Seed Date',   // headerTitle
      'arrow_back', // leftIconName
      'volume_up',   // rightIconName
      this.handleLeftClick.bind(this),  // leftBtnClick
      null,          // rightBtnClick
    );
  }

  public backClicked() {
    this.location.back();
  }

  public onHeaderClick(data:string){
    if(data == 'leftBtn'){
      this.backClicked();
    }else {
      //TODO
    }
  }

  public handleLeftClick(data: string){
    this.backClicked();
  }

  public volumeClicked() {}

  clickConfirm(userSelectedDate: Date) {
    const todayDate = new DateTimeUtil().getTodayDate();
    const numberOfDaysFromSeedingDate = Math.floor(
      Math.abs(todayDate.getTime() - userSelectedDate.getTime()) /
        (1000 * 3600 * 24)
    );

    // identify the current crop growth stage based on the number days of seeding date
    // const stage: PlantGrowthStage = this.identifyGrowthStage(numberOfDaysFromSeedingDate);

    // add crop info to my crops list
    this.crop.seedingDate = userSelectedDate;
    this.cropService.storeMyCropsInLocalStorage(this.crop).then(r => {});
    // store selected crop id in session to generate water advise
    this.cropService.storeSelectedCropIdInSession(this.crop.id);
    this.cropService.setCrop(this.crop);
    this.router.navigate(['/measure-soil', this.crop.id], { state: { crop: this.crop } }).then((r) => {});

  }

  // @desc  Identify the current crop growth stage based on the number of days from the seeding date
  // @param numberOfDaysFromSeedingDate
  // @return The current crop growth stage
  private identifyGrowthStage(numberOfDaysFromSeedingDate) {
    const stages = this.crop.facts.plantGrowthStages.stages;
    let stage: PlantGrowthStage;
    const cummulativeStagesLength: number[] = [stages[0].stageLength];

    for (let i = 1; i < stages.length; i++) {
      cummulativeStagesLength[i] = cummulativeStagesLength[i - 1] + stages[i].stageLength;
    }

    // Find the first stage where the number of days is less than or equal to the cumulative length
    const index = cummulativeStagesLength.findIndex(length => numberOfDaysFromSeedingDate <= length);

    // If the index is not found, default to the last stage
    const selectedStageIndex = index !== -1 ? index : stages.length - 1;
    stage = stages[selectedStageIndex];

    return stage;
  }
}
