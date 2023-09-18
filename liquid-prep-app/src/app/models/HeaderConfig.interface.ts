export interface HeaderConfig {
  headerTitle?: string;
  leftIconName?: string;
  rightIconName?: string;
  leftBtnClick?: (() => void) | null;
  rightBtnClick?: (() => void) | null;
  sortIconName?: string;
  sortBtnClick?: (() => void) | null;
  filterIconName?: string;
  filterBtnClick?: (() => void) | null;
  rightTextBtn?: string;
  rightTextBtnClick?: (() => void) | null;
}
