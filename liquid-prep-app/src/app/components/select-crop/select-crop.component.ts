import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import { Crop } from '../../models/Crop';
import { CropDataService } from '../../service/CropDataService';
import { HeaderService } from 'src/app/service/header.service';
import { forkJoin, from } from 'rxjs';

@Component({
  selector: 'app-select-crop',
  templateUrl: './select-crop.component.html',
  styleUrls: ['./select-crop.component.scss']
})

export class SelectCropComponent implements OnInit{

  searchText = '';
  // title = 'Select Crop';

  @ViewChild('searchbar') searchbar: ElementRef;

  toggleSearch = false;
  cropsList: Crop[];
  NO_NEW_CROPS = '../../assets/crops-images/noNewCrops.PNG';
  public requestingCrop = true;

  constructor(private router: Router, private location: Location,
              private cropService: CropDataService,
              private headerService: HeaderService) { }

  ngOnInit(): void {
    this.requestingCrop = true;

    this.headerService.updateHeader(
      'Add a new crop',                  // headerTitle
      'close',                     // leftIconName
      'search',                         // rightIconName
      this.handleLeftClick.bind(this),  // leftBtnClick
      null,                             // rightBtnClick
    );

    forkJoin({
      cropsListData: this.cropService.getCropListFromApi(),
      myCrops: from(this.cropService.getLocalStorageMyCrops())
    }).subscribe(
      (results) => {
        const cropsListData = results.cropsListData;
        const myCrops = results.myCrops;

        this.cropsList = cropsListData.filter((crop) => {
          return !myCrops.some((myCrop) => myCrop.id === crop.id);
        });

        console.log('select cropsList:', this.cropsList);
        this.requestingCrop = false;
      },
      (error) => {
        alert('Could not get crop list: ' + error);
        this.requestingCrop = false;
      }
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

  public handleLeftClick(){
    this.backToMyCrops();
  }

  backToMyCrops(){
    this.location.back();
  }

  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }

  addCrop(clickedCrop: Crop) {
    this.router.navigateByUrl('/seed-date/' + clickedCrop.id).then(r => {});
  }

  filterFunction(): Crop[]{
    if (this.searchText === null || this.searchText === ''){
      return this.cropsList;
    }else{
      return this.cropsList.filter(i => i.cropName.includes( this.searchText));
    }
  }
}
