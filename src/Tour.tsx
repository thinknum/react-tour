import * as React from "react";
import { compose, setDisplayName } from "recompose";
import { getRectOfElementBySelector } from "./helpers";
import { Overlay } from "./Overlay";
import { Portal } from "./Portal";
import { TourModal } from "./TourModal";
import { Step } from ".";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  step: Step;
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

interface ITemplateState {
  isPaused: boolean;
  isFinished: boolean;
  stepIndex: number;
}

class Template extends React.PureComponent<ITemplateProps> {

  public render() {
    const {step} = this.props;

    const rect = getRectOfElementBySelector(step.target);
    if (!rect) {
      return null;
    }

    const left = Math.round(rect.left);
    const top = Math.round(rect.top);

    return (
      <Portal id="tour-portal">
        <Overlay target={step.target} />
        <TourModal x={left} y={top} />
      </Portal>
    );
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const Tour = compose<ITemplateProps, IOuterProps>(
  setDisplayName("Tour"),
)(Template);