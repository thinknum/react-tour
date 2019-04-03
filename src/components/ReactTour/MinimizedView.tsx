import {TourStatus} from "state/reactTour/types";
import cx from "classnames";
import * as React from "react";
import {compose, setDisplayName} from "recompose";
import * as styles from "./styles.scss";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  isVisible: boolean;
  tourStatus: TourStatus;
  onOpenClicked: () => void;
  onSkipClicked: () => void;
  currentStepIdx: number;
  stepsCount: number;
}

/* Template
-------------------------------------------------------------------------*/

interface ITemplateState {
  isViewVisible: boolean;
  animatePop: boolean;
}

type ITemplateProps = IOuterProps;

class Template extends React.PureComponent<ITemplateProps, ITemplateState> {
  // Properties

  private timeouts: any[] = [];

  public state: ITemplateState = {
    isViewVisible: false,
    animatePop: false,
  };

  // Lifecycle

  public componentDidMount() {
    if (this.props.isVisible) {
      this.animateShow();
    }
  }

  public componentWillUnmount() {
    this.clearTimeouts();
  }

  public componentDidUpdate(prevProps: ITemplateProps) {
    const {isVisible} = this.props;
    const {isViewVisible} = this.state;

    if (!prevProps.isVisible && this.props.isVisible) {
      this.animateShow();
    } else if (prevProps.isVisible && !this.props.isVisible) {
      this.setState({isViewVisible: false});
    }

    if (!isVisible && isViewVisible) {
      this.setState({isViewVisible: false});
    }
  }

  public render() {
    const {tourStatus, isVisible} = this.props;
    const {isViewVisible, animatePop} = this.state;
    const isMinimized = tourStatus === TourStatus.MINIMALIZED;

    return (
      <div
        className={cx(styles.MinimizedView, {
          [styles.isVisible]: isViewVisible,
          [styles.pop]: animatePop,
          [styles.isMinimized]: isMinimized,
        })}
      >
        <div className={styles.openTourSection} onClick={this.handleOpenClick}>
          <svg
            className={cx({[styles.isPulsing]: isMinimized})}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
          >
            <path
              fill="#778fa9"
              d="M17.699 8.345L9.613.258a.896.896 0 0 0-1.267 0L.261 8.345a.899.899 0 0 0 0 1.271l8.085 8.083v.004a.899.899 0 0 0 1.271 0l8.086-8.087a.897.897 0 0 0-.004-1.271zm-7.704 2.113v-1.48h-3v2.582a.458.458 0 0 1-.457.458H5.475a.465.465 0 0 1-.464-.465V7.892c0-.496.402-.898.898-.898h4.086v-1.48c0-.283.342-.424.542-.224l3.04 2.54a.354.354 0 0 1 0 .5l-3.04 2.353c-.2.2-.542.058-.542-.225z"
            />
          </svg>
          <span>{this.getLabelText()}</span>
        </div>
        <div
          className={cx(styles.skipSection, {
            [styles.isMinimized]: isMinimized,
          })}
          onClick={this.handleSkipClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
            <path
              fillRule="evenodd"
              fill="#C0D7E5"
              d="M7.764,6.706 L5.050,3.992 L7.764,1.278 C8.057,0.984 8.057,0.513 7.764,0.220 C7.471,-0.073 6.999,-0.073 6.706,0.220 L3.992,2.934 L1.277,0.220 C0.984,-0.073 0.513,-0.073 0.220,0.220 C-0.074,0.513 -0.074,0.984 0.220,1.278 L2.934,3.992 L0.220,6.706 C-0.074,6.999 -0.074,7.471 0.220,7.764 C0.513,8.057 0.984,8.057 1.277,7.764 L3.992,5.050 L6.706,7.764 C6.999,8.057 7.471,8.057 7.764,7.764 C8.055,7.471 8.055,6.997 7.764,6.706 Z"
            />
          </svg>
        </div>
      </div>
    );
  }

  private getLabelText() {
    const {currentStepIdx, stepsCount, tourStatus} = this.props;
    const stepsText = `(${currentStepIdx + 1}/${stepsCount})`;
    if (tourStatus === TourStatus.MINIMALIZED) {
      return `Continue tour ${stepsText}`;
    }
    return `Tour running ${stepsText}`;
  }

  private animateShow() {
    const timeoutA = setTimeout(() => {
      this.setState({isViewVisible: true, animatePop: true});
    }, 300);
    this.timeouts.push(timeoutA);
    const timeoutB = setTimeout(() => {
      this.setState({animatePop: false});
    }, 1500);
    this.timeouts.push(timeoutB);
  }

  // Event handlers

  private handleSkipClick = () => {
    const {onSkipClicked} = this.props;
    this.setState({isViewVisible: false});
    onSkipClicked();
  };

  private handleOpenClick = () => {
    const {onOpenClicked} = this.props;
    onOpenClicked();
  };

  // Helpers

  private clearTimeouts() {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const MinimizedView: React.ComponentClass<IOuterProps> = compose<ITemplateProps, IOuterProps>(setDisplayName("MinimizedView"))(Template);
