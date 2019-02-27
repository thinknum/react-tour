/* Generic
-------------------------------------------------------------------------*/

export interface Step {
  target: string;
  title?: string;
  content?: string;
  position: TourModalPosition;
}

export enum TourModalPosition {
  RIGHT_TOP = "right-top",
}

export {ReactTour} from "./ReactTour";