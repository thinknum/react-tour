import * as Actions from "state/reactTour/actions";
import * as Selectors from "state/reactTour/selectors";
import {IState as RectTourState, TourStatus} from "state/reactTour/types";
import {isEqualWith} from "lodash";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import {compose, setDisplayName} from "recompose";
import {AutomatedGuide} from "./AutomatedGuide";
import {getElementBySelector, getRectOfElementBySelector} from "./helpers";
import {MinimizedView} from "./MinimizedView";
import {Portal} from "./Portal";
import {STORE_KEY} from "./ReactTourProvider";
import {TourModal} from "./TourModal";
import {ReactStory, ReactStoryStep} from "./types";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  story: ReactStory;
  onTourFinished: () => void;
  onTourSkipped: () => void;
}

/* Connect
-------------------------------------------------------------------------*/

interface IReduxProps {
  currentStepIdx: number;
  currentStep: ReactStoryStep;
  tourStatus: TourStatus;
  interactionKeys: Set<string>;
}

const mapStateToProps = (state: RectTourState, props: IOuterProps): IReduxProps => {
  const currentStepIdx = Selectors.getCurrentStepIndex(state);
  const currentStep = props.story.steps[currentStepIdx];
  const tourStatus = Selectors.getTourStatus(state);
  const interactionKeys = Selectors.getInteractionKeys(state);

  return {
    currentStepIdx,
    currentStep,
    tourStatus,
    interactionKeys,
  };
};

const withConnect = connect(
  mapStateToProps,
  undefined,
  undefined,
  {
    storeKey: STORE_KEY,
  },
);

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps & IReduxProps & DispatchProp<any>;

interface ITemplateState {
  isWaitingForElement: boolean;
}

class Template extends React.PureComponent<ITemplateProps, ITemplateState> {
  // Constants

  private static readonly defaultStartDelay = 1000;
  private static readonly defaultStepDelay = 500;

  private resizeTimeout: any;

  private modalRef = React.createRef<HTMLDivElement>();

  // State

  public state: ITemplateState = {
    isWaitingForElement: false,
  };

  // Lifecycle

  public componentDidMount() {
    this.startTour();
    window.addEventListener("resize", this.handleResize);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  private handleResize = () => {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      clearTimeout(this.resizeTimeout);
      this.forceUpdate();
    }, 100);
  };

  public componentDidUpdate(prevProps: ITemplateProps) {
    const {story, tourStatus, currentStep, onTourFinished} = this.props;
    const {isWaitingForElement} = this.state;
    const steps = story.steps;

    if (tourStatus === TourStatus.FINISH) {
      setTimeout(() => {
        onTourFinished();
      }, 500); // Delay to preserve hiding animation
      return;
    }

    const stepComparator = function(stepA: ReactStoryStep, stepB: ReactStoryStep) {
      return stepA.target === stepB.target;
    };

    if (!isEqualWith(steps, prevProps.story.steps, stepComparator)) {
      this.startTour();
    }

    if (prevProps.tourStatus !== TourStatus.INTERACTION_STARTED && tourStatus === TourStatus.INTERACTION_STARTED) {
      this.hideModal();
    } else if (
      prevProps.tourStatus !== TourStatus.INTERACTION_FINISHED &&
      tourStatus === TourStatus.INTERACTION_FINISHED
    ) {
      this.handleNext();
    }

    if (isWaitingForElement) {
      this.setState({isWaitingForElement: false});
      this.showStep();
    }

    if (prevProps.tourStatus !== TourStatus.MODAL_VISIBLE && tourStatus === TourStatus.MODAL_VISIBLE) {
      this.registerClickListener();
    } else if (prevProps.tourStatus === TourStatus.MODAL_VISIBLE && tourStatus !== TourStatus.MODAL_VISIBLE) {
      this.unregisterClickListener();
    }

    if (prevProps.currentStep !== currentStep && currentStep.autoFocus) {
      this.focusElement();
    }
  }

  public render() {
    const {story, currentStepIdx, currentStep, tourStatus} = this.props;
    const {steps, buttonsTexts} = story;

    if (!currentStep) {
      return null;
    }

    const rect = getRectOfElementBySelector(currentStep.target);
    if (!rect) {
      return null;
    }

    return (
      <Portal id="tour-portal">
        <TourModal
          step={currentStep}
          globalButtonsTexts={buttonsTexts}
          hasNext={this.hasNextStep()}
          targetRect={rect}
          isVisible={tourStatus === TourStatus.MODAL_VISIBLE}
          onNextClicked={this.handleNextClick}
          onSkipClicked={this.handleSkip}
          width={currentStep.modalWidth}
          modalRef={this.modalRef}
        />
        <MinimizedView
          isVisible={
            tourStatus !== TourStatus.MODAL_VISIBLE &&
            tourStatus !== TourStatus.PREPARE_TO_SHOW &&
            tourStatus !== TourStatus.FINISH
          }
          tourStatus={tourStatus}
          onSkipClicked={this.handleSkip}
          onOpenClicked={() => this.showStep(true)}
          currentStepIdx={currentStepIdx}
          stepsCount={steps.length}
        />
        {tourStatus === TourStatus.AUTOMATION && currentStep.automatedSteps && (
          <AutomatedGuide
            automatedSteps={currentStep.automatedSteps}
            onAutomationFinished={this.handleAutomationFinished}
            onAutomationInterrupted={this.handleAutomationInterrupted}
          />
        )}
      </Portal>
    );
  }

  // Navigation handlers

  private startTour() {
    const {story, dispatch} = this.props;
    const {startDelay, steps} = story;
    dispatch(Actions.setSteps({steps}));
    const delay = startDelay !== undefined ? startDelay : Template.defaultStartDelay;
    setTimeout(() => {
      this.showStep(true);
    }, delay);
  }

  private showStep(skipDelay?: boolean) {
    const {currentStep} = this.props;
    if (!currentStep) {
      return;
    }

    const rect = getRectOfElementBySelector(currentStep.target);
    if (!rect) {
      this.setState({isWaitingForElement: true});
      return;
    }

    if (skipDelay) {
      this.showModal();
    } else {
      const delay = this.getStepDelay();
      setTimeout(() => {
        this.showModal();
      }, delay);
    }
  }

  private handleNext = () => {
    const {story, onTourFinished, currentStepIdx, dispatch} = this.props;
    const {steps} = story;
    this.hideModal(() => {
      const newStepIdx = currentStepIdx + 1;
      if (newStepIdx === steps.length) {
        onTourFinished();
      } else {
        dispatch(Actions.setStepIndex({idx: newStepIdx}));
        this.showStep();
      }
    });
  };

  private handleSkip = () => {
    const {onTourSkipped} = this.props;

    this.hideModal(() => {
      onTourSkipped();
    });
  };

  private showModal() {
    const {dispatch} = this.props;
    dispatch(Actions.show({}));
  }

  private hideModal(completion?: () => void) {
    const {dispatch} = this.props;
    dispatch(Actions.hide({}));
    setTimeout(() => {
      if (completion) {
        completion();
      }
    }, 800);
  }

  private handleNextClick = () => {
    const {dispatch, currentStep} = this.props;

    if (currentStep.automatedSteps) {
      dispatch(Actions.startAutomation({}));
      return;
    }

    if (!this.hasNextStep()) {
      this.handleNext();
      return;
    }

    if (currentStep.canProceedWithoutInteraction) {
      this.handleNext();
    } else {
      dispatch(Actions.minimalize({}));
    }
  };

  private handleAutomationFinished = () => {
    this.handleNext();
  };

  private handleAutomationInterrupted = () => {
    const {dispatch} = this.props;
    dispatch(Actions.interruptAutomation({}));
  };

  // Click listeners

  private registerClickListener() {
    setTimeout(() => {
      window.addEventListener("click", this.handleDocumentClick, false);
    }, 500);
  }

  private unregisterClickListener() {
    window.removeEventListener("click", this.handleDocumentClick, false);
  }

  private handleDocumentClick = (ev: any) => {
    const {dispatch, currentStep, currentStepIdx, story, onTourFinished} = this.props;
    const {steps} = story;
    const modalElement = this.modalRef.current;
    if (!modalElement || !ev.target) {
      return;
    }

    if (modalElement.contains(ev.target)) {
      return;
    }

    const stepTargetElement = getElementBySelector(currentStep.target);
    if (stepTargetElement && stepTargetElement.contains(ev.target)) {
      return;
    }

    if (!this.hasNextStep()) {
      dispatch(Actions.finish({}));
      return;
    }

    setTimeout(() => {
      dispatch(Actions.minimalize({}));
    }, 300); // Delay to catch possible step interaction
  };

  // Helpers

  private hasNextStep() {
    const {currentStepIdx, story} = this.props;
    const {steps} = story;
    return !(currentStepIdx === steps.length - 1);
  }

  private getStepDelay() {
    const {story, currentStep} = this.props;
    const {nextStepDelay} = story;
    if (currentStep.delay) {
      return currentStep.delay;
    }

    if (nextStepDelay) {
      return nextStepDelay;
    }

    return Template.defaultStepDelay;
  }

  private focusElement() {
    const {currentStep, tourStatus} = this.props;
    const element: any = getElementBySelector(currentStep.target);
    if (!element) {
      return;
    }
    const delay = this.getStepDelay();
    setTimeout(() => {
      if (tourStatus === TourStatus.MODAL_VISIBLE || tourStatus === TourStatus.PREPARE_TO_SHOW) {
        element.focus();
      }
    }, delay);
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const ReactTour = compose<ITemplateProps, IOuterProps>(
  withConnect,
  setDisplayName("ReactTour"),
)(Template);
