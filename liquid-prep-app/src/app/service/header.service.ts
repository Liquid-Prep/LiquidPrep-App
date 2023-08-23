import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerTitle: string = '';
  leftIconName: string = '';
  rightIconName: string = '';
  leftBtnClick: () => void | null;
  rightBtnClick: () => void | null;

  updateHeader(
    headerTitle: string,
    leftIconName: string,
    rightIconName: string,
    leftBtnClick: () => void | null,
    rightBtnClick: () => void | null,
  ): void {
    this.headerTitle = headerTitle;
    this.leftIconName = leftIconName;
    this.rightIconName = rightIconName;
    this.leftBtnClick = leftBtnClick;
    this.rightBtnClick = rightBtnClick;
  }
}
