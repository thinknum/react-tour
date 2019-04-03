export interface ReactStory {
  steps: ReactStoryStep[];
  starterElement: string;
  waitForEvents?: string[];
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
  FAKE_CLICK = "fake-click",
  TEXT_INPUT = "text-input",
  WAIT = "wait",
  SCROLL = "scroll",
  REMOVE_EVENT_KEY = "remove-event",
  PERFORM_HANDLER = "perform-handler",
}

export enum ScrollToSide {
  BOTTOM = "bottom",
}

export type AutomatedEvent =
  | ClickAutomatedEvent
  | FakeClickAutomatedEvent
  | TypingAutomatedEvent
  | WaitAutomatedEvent
  | ScrollAutomatedEvent
  | RemoveEventAutomatedEvent
  | PerformHandlerAutomatedEvent;

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
  waitFor: string;
}

export interface RemoveEventAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.REMOVE_EVENT_KEY;
  keyToRemove: string;
}

export interface ScrollAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.SCROLL;
  scrollToTarget?: string;
  scrollToSide?: ScrollToSide;
}

export interface PerformHandlerAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.PERFORM_HANDLER;
  handler: () => void;
}

export interface FakeClickAutomatedEvent extends BaseAutomatedEvent {
  type: AutomatedEventType.FAKE_CLICK;
  handler?: () => void;
  hoverHandler?: () => void;
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
