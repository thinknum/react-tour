import {ModalPositionSide, TourModalPosition} from "./types";

export function getElementBySelector(selector: string): HTMLElement | undefined {
  if (typeof selector !== "string") {
    return undefined;
  }

  const element = document.querySelector(selector);
  if (!element) {
    return undefined;
  } else {
    return element as HTMLElement;
  }
}

export function getRectOfElementBySelector(selector: string) {
  const element = getElementBySelector(selector);
  if (!element) {
    return undefined;
  }

  return element.getBoundingClientRect();
}

export function getPositionSide(position: TourModalPosition): ModalPositionSide {
  switch (position) {
    case TourModalPosition.RIGHT_CENTER:
    case TourModalPosition.RIGHT_TOP:
      return ModalPositionSide.RIGHT;
    case TourModalPosition.LEFT_TOP:
    case TourModalPosition.LEFT_CENTER:
      return ModalPositionSide.LEFT;
    case TourModalPosition.BOTTOM_CENTER:
      return ModalPositionSide.BOTTOM;
  }
}
