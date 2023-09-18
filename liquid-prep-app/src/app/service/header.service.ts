import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerConfig: HeaderConfig = new HeaderConfig();

  updateHeader(headerConfig: HeaderConfig): void {
    this.headerConfig = headerConfig;
  }
}

export class HeaderConfig {
  constructor(
    public headerTitle?: string,
    public leftIconName?: string,
    public rightIconName?: string,
    public leftBtnClick?: (() => void) | null,
    public rightBtnClick?: (() => void) | null,
    public sortIconName?: string,
    public sortBtnClick?: (() => void) | null,
    public filterIconName?: string,
    public filterBtnClick?: (() => void) | null,
    public rightTextBtn?: string,
    public rightTextBtnClick?: (() => void) | null
  ) {}
}
