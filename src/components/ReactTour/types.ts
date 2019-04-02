export interface ReactStory {
  steps: ReactStoryStep[];
  starterElement: string;
  startDelay?: number;
  nextStepDelay?: number;
  buttonsTexts?: ButtonsTexts;
}

export interface ReactStoryStep {
  target: string;
  title?: string;
  titleEmoji?: string;
  content?: string;
  note?: string;
  autoFocus?: boolean;
  position: TourModalPosition;
  delay?: number;
  interactionStartKey?: string;
  interactionEndKey?: string;
  canProceedWithoutInteraction?: boolean;
  modalWidth?: number;
  buttonsTexts?: ButtonsTexts;
  automatedSteps?: AutomatedEvent[];
}

export enum AutomatedEventType {
  CLICK = "click",
  TEXT_INPUT = "text-input",
  WAIT = "wait",
  SCROLL = "scroll",
}

export type AutomatedEvent = ClickAutomatedEvent | TypingAutomatedEvent | WaitAutomatedEvent | ScrollAutomatedEvent;

export interface BaseAutomatedEvent {
  type: AutomatedEventType;
  target: string;
  waitAfter?: number;
}

export interface ClickAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.CLICK;
  hoverTarget?: string;
}

export interface TypingAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.TEXT_INPUT;
  input: string;
}

export interface WaitAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.WAIT;
  waitFor: string; // TourEventKeys
}

export interface ScrollAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.SCROLL;
  scrollToTarget: string;
}

export interface ButtonsTexts {
  next?: string;
  skip?: string;
  finish?: string;
}

export enum TourModalPosition {
  RIGHT_TOP = "right-top",
  RIGHT_CENTER = "right-center",
  LEFT_TOP = "left-top",
  LEFT_CENTER = "left-center",
  BOTTOM_CENTER = "bottom-center",
}

export enum ModalPositionSide {
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
}
