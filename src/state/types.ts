/* State
-------------------------------------------------------------------------*/

export interface IState {
  startedActions: string[];
}

/* Action types
-------------------------------------------------------------------------*/

export enum ActionType {
  TEST = "React Tour - Test",
}

/* Action payloads
-------------------------------------------------------------------------*/

export interface ITestPayload {
}