import * as cx from "classnames";
import * as React from "react";
import {compose, setDisplayName} from "recompose";
import {ButtonsTexts, TourModalPosition} from "../index";
import {Button} from "./Button";
import * as styles from "./styles.scss";

enum ButtonType {
  SKIP = "skip",
  NEXT = "next",
  FINISH = "finish",
}

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  globalButtonsTexts?: ButtonsTexts;
  stepButtonsTexts?: ButtonsTexts;
  hasNext: boolean;
  targetRect: ClientRect;
  position: TourModalPosition;
  isVisible: boolean;
  title?: string;
  content?: string;
  onSkipClicked?: () => void;
  onNextClicked?: () => void;
  width?: number;
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

class Template extends React.PureComponent<ITemplateProps> {
  public render() {
    const {isVisible, title, content, hasNext} = this.props;
    const positionStyle = this.getModalPosition();

    return (
      <div
        className={cx(styles.TourModal, {
          [styles.isVisible]: isVisible,
          [styles.verticalCenter]: this.shouldUseVerticalCenter(),
        })}
        style={positionStyle}
      >
        <div className={styles.modalBody}>
          {title !== undefined ? <h3>{title}</h3> : null}

          {content !== undefined ? <p>{content}</p> : null}

          <div className={styles.actions}>
            {hasNext && (
              <Button
                label={this.getButtonText(ButtonType.SKIP)}
                color={"transparent"}
                hoverColor={"transparent"}
                textColor="#96a4b3"
                textHoverColor="#798796"
                onClick={this.handleSkipClick}
                className={styles.skip}
              />
            )}
            <Button
              label={this.getButtonText(
                hasNext ? ButtonType.NEXT : ButtonType.FINISH,
              )}
              onClick={this.handleNextClick}
            />
          </div>
        </div>

        <div className={styles.arrow} style={this.getArrowStyle()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17">
            <path
              fillRule="evenodd"
              fill="#FFF"
              d="M0.550,7.086 L7.566,0.015 L15.985,8.500 L7.566,16.985 L0.550,9.914 C-0.225,9.133 -0.225,7.867 0.550,7.086 Z"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Event handlers

  private handleSkipClick = () => {
    const {onSkipClicked} = this.props;

    if (onSkipClicked) {
      onSkipClicked();
    }
  };

  private handleNextClick = () => {
    const {onNextClicked} = this.props;

    if (onNextClicked) {
      onNextClicked();
    }
  };

  // Helpers

  private shouldUseVerticalCenter() {
    const {position} = this.props;
    if (position === TourModalPosition.RIGHT_CENTER) {
      return true;
    }
    return false;
  }

  private getModalPosition(): React.CSSProperties {
    const {targetRect, position, width} = this.props;

    const padding = 5;

    let styles: React.CSSProperties = {};
    if (width) {
      styles.width = width;
    }

    switch (position) {
      case TourModalPosition.RIGHT_TOP:
        return {
          ...styles,
          top: targetRect.top,
          left: targetRect.left + targetRect.width + padding,
          flexDirection: "row-reverse",
        };
      case TourModalPosition.RIGHT_CENTER:
        return {
          ...styles,
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left + targetRect.width + padding,
          flexDirection: "row-reverse",
          alignItems: "center",
        };
      default:
        break;
    }

    return styles;
  }

  private getArrowStyle(): React.CSSProperties {
    const {targetRect, position} = this.props;

    const arrowHalfHeight = 8;

    switch (position) {
      case TourModalPosition.RIGHT_TOP:
        const arrowPadding = targetRect.height / 2 - arrowHalfHeight;
        return {
          marginRight: -10,
          paddingTop: arrowPadding,
        };
      case TourModalPosition.RIGHT_CENTER:
        return {
          marginRight: -10,
        };
      default:
        break;
    }

    return {};
  }

  private getButtonText(buttonType: ButtonType) {
    const {globalButtonsTexts, stepButtonsTexts} = this.props;

    const defaultButtonsTexts: ButtonsTexts = {
      next: "Next",
      skip: "Skip",
      finish: "Finish",
    };

    if (stepButtonsTexts && stepButtonsTexts[buttonType]) {
      return stepButtonsTexts[buttonType];
    } else if (globalButtonsTexts && globalButtonsTexts[buttonType]) {
      return globalButtonsTexts[buttonType];
    } else {
      return defaultButtonsTexts[buttonType];
    }
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const TourModal = compose<ITemplateProps, IOuterProps>(
  setDisplayName("TourModal"),
)(Template);
