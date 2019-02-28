/* Generic
-------------------------------------------------------------------------*/

export interface Step {
  target: string;
  title?: string;
  content?: string;
  position: TourModalPosition;
  modalWidth?: number;
  buttonsTexts?: ButtonsTexts;
}

export interface ButtonsTexts {
  next?: string;
  skip?: string;
  finish?: string;
}

export enum TourModalPosition {
  RIGHT_TOP = "right-top",
  RIGHT_CENTER = "right-center",
}

export {ReactTour} from "./ReactTour";