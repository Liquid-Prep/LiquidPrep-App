import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerTitle: string = '';
  leftIconName: string = '';
  rightIconName: string = '';
  leftBtnClick: (() => void) | null = null;
  rightBtnClick: (() => void) | null = null;
  sortIconName: string = '';
  sortBtnClick: (() => void) | null = null;
  filterIconName: string = '';
  filterBtnClick: (() => void) | null = null;

  updateHeader(
    headerTitle: string,
    leftIconName: string,
    rightIconName: string,
    leftBtnClick: (() => void) | null,
    rightBtnClick: (() => void) | null,
    sortIconName?: string,
    sortBtnClick?: (() => void) | null,
    filterIconName?: string,
    filterBtnClick?: (() => void) | null,
  ): void {
    this.headerTitle = headerTitle;
    this.leftIconName = leftIconName;
    this.rightIconName = rightIconName;
    this.leftBtnClick = leftBtnClick;
    this.rightBtnClick = rightBtnClick;
    this.sortIconName = sortIconName || '';
    this.sortBtnClick = sortBtnClick || null;
    this.filterIconName = filterIconName || '';
    this.filterBtnClick = filterBtnClick || null;
  }
}
