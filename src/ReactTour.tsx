import { isEqual } from "lodash";
import * as React from "react";
import { compose, setDisplayName } from "recompose";
import { Step } from ".";
import { getRectOfElementBySelector } from "./helpers";
import { Overlay } from "./Overlay";
import { Portal } from "./Portal";
import { TourModal, ButtonsTexts } from "./TourModal";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  steps: Step[];
  onTourFinished: () => void;
  onTourSkipped: () => void;
  startDelay?: number;
  nextStepDelay?: number;
  buttonsTexts?: ButtonsTexts;
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

interface ITemplateState {
  isActive: boolean;
  stepIndex: number;
  isModalVisible: boolean;
}

class Template extends React.PureComponent<ITemplateProps, ITemplateState> {

  // Constants

  private static readonly defaultStartDelay = 1000;
  private static readonly defaultStepDelay = 0;

  // State

  public state: ITemplateState = {
    isActive: false,
    stepIndex: 0,
    isModalVisible: false,
  }

  // Lifecycle

  public componentDidMount() {
    this.startTour();
  }

  public componentDidUpdate(prevProps: ITemplateProps) {
    const {steps} = this.props;

    if (!isEqual(steps, prevProps.steps)) {
      console.log("Steps changed - start tour with delay");
      this.startTour();
    }
  }

  public render() {
    const {steps, buttonsTexts} = this.props;
    const {stepIndex, isModalVisible} = this.state;

    const step = steps[stepIndex];
    if (!step) {
      return null;
    }
    const hasNext = !(stepIndex === (steps.length - 1));

    const rect = getRectOfElementBySelector(step.target);
    if (!rect) {
      return null;
    }

    return (
      <Portal id="tour-portal">
        {isModalVisible ? (
          <Overlay target={step.target} onClick={this.handleNext} />
        ) : null}
        <TourModal
          buttonsTexts={buttonsTexts}
          hasNext={hasNext}
          targetRect={rect}
          position={step.position}
          isVisible={isModalVisible}
          title={step.title}
          content={step.content}
          onNextClicked={this.handleNext}
          onSkipClicked={this.handleSkip}
          width={step.modalWidth}
        />
      </Portal>
    );
  }

  // Navigation handlers

  private startTour() {
    const {startDelay} = this.props;
    const delay = startDelay !== undefined ? startDelay : Template.defaultStartDelay;
    setTimeout(() => {
      this.setState({isActive: true});
      this.showStep(true);
    }, delay);
  }

  private showStep(skipDelay?: boolean) {
    if (skipDelay) {
      console.log("Skip to visible");
      this.setState({isModalVisible: true});
    } else {
      const {nextStepDelay} = this.props;
      const delay = nextStepDelay !== undefined ? nextStepDelay : Template.defaultStepDelay;
      setTimeout(() => {
        console.log("Delay to visible");
        this.setState({isModalVisible: true});
      }, delay);
    }
  }

  private handleNext = () => {
    const {steps, onTourFinished} = this.props;
    const {stepIndex} = this.state;
    this.hideModal(() => {
      const newStepIdx = stepIndex + 1;
      if (newStepIdx === steps.length) {
        this.setState({isActive: false});
        onTourFinished();
      } else {
        console.log("Idx changed");
        this.setState({stepIndex: newStepIdx});
        this.showStep();
      }
    })
  }

  private handleSkip = () => {
    const {onTourSkipped} = this.props;
    console.log("Handling skip");

    this.hideModal(() => {
      onTourSkipped();
    })
  }

  private hideModal(completion: () => void) {
    console.log("Hide modal");
    this.setState({isModalVisible: false});
    setTimeout(() => {
      console.log("Completion");
      completion();
    }, 800);
  }

  // Helpers
}

/* Compose
-------------------------------------------------------------------------*/

export const ReactTour = compose<ITemplateProps, IOuterProps>(
  setDisplayName("ReactTour"),
)(Template);