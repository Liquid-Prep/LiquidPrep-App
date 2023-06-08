import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerTitle: string = '';
  leftIconName: string = '';
  rightIconName: string = '';
  leftBtnClick: Function | null = null;
  rightBtnClick: Function | null = null;

  updateHeader(
    headerTitle: string,
    leftIconName: string,
    rightIconName: string,
    leftBtnClick: Function | null = null,
    rightBtnClick: Function | null = null,
  ): void {
    this.headerTitle = headerTitle;
    this.leftIconName = leftIconName;
    this.rightIconName = rightIconName;
    this.leftBtnClick = leftBtnClick;
    this.rightBtnClick = rightBtnClick;
  }
}
