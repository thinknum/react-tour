/* Generic
-------------------------------------------------------------------------*/

export interface Step {
  target: string;
  title?: string;
  content?: string;
  position: "bottom-left" | "bottom-center";
}

export {Tour} from "./Tour";