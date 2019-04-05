import cx from "classnames";
import * as React from "react";
import {compose, setDisplayName} from "recompose";
import {Button} from "./Button";
import {getPositionSide} from "./helpers";
import * as styles from "./styles.scss";
import {ButtonsTexts, ModalPositionSide, ReactStoryStep, TourModalPosition} from "./types";

enum ButtonType {
  SKIP = "skip",
  NEXT = "next",
  FINISH = "finish",
}

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  step: ReactStoryStep;
  globalButtonsTexts?: ButtonsTexts;
  hasNext: boolean;
  targetRect: ClientRect;
  isVisible: boolean;
  onSkipClicked?: () => void;
  onNextClicked?: () => void;
  width?: number;
  modalRef: React.RefObject<HTMLDivElement>;
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

class Template extends React.PureComponent<ITemplateProps> {
  public render() {
    const {step, isVisible, hasNext, modalRef} = this.props;
    const {title, titleEmoji, content, note, position} = step;
    const modalSide = getPositionSide(position);
    const positionStyle = this.getModalPosition();

    return (
      <div
        ref={modalRef}
        id="TourModalBody"
        className={cx(styles.TourModal, {[styles.isVisible]: isVisible})}
        style={positionStyle}
      >
        <div className={styles.modalBody}>
          {title !== undefined ? (
            <div className={styles.title}>
              <h3>{title}</h3>
              <h5>{titleEmoji}</h5>
            </div>
          ) : null}

          {content !== undefined ? <p dangerouslySetInnerHTML={{__html: content}} /> : null}

          {note !== undefined ? <p className={styles.note} dangerouslySetInnerHTML={{__html: note}} /> : null}

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
              label={this.getButtonText(hasNext ? ButtonType.NEXT : ButtonType.FINISH)}
              onClick={this.handleNextClick}
            />
          </div>
        </div>

        <div className={styles.arrow} style={this.getArrowStyle(modalSide)}>
          {this.getArrowSVG(modalSide)}
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

  private getArrowSVG(side: ModalPositionSide) {
    switch (side) {
      case ModalPositionSide.BOTTOM:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
            <path
              fillRule="evenodd"
              fill="#FFF"
              d="M9.914,0.550 L16.985,7.566 L8.500,15.985 L0.015,7.566 L7.086,0.550 C7.867,-0.225 9.133,-0.225 9.914,0.550 Z"
            />
          </svg>
        );
      case ModalPositionSide.LEFT:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17">
            <path
              fillRule="evenodd"
              fill="#FFF"
              d="M15.450,9.914 L8.434,16.985 L0.015,8.500 L8.434,0.015 L15.450,7.086 C16.225,7.867 16.225,9.133 15.450,9.914 Z"
            />
          </svg>
        );
      case ModalPositionSide.RIGHT:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17">
            <path
              fillRule="evenodd"
              fill="#FFF"
              d="M0.550,7.086 L7.566,0.015 L15.985,8.500 L7.566,16.985 L0.550,9.914 C-0.225,9.133 -0.225,7.867 0.550,7.086 Z"
            />
          </svg>
        );
    }
  }

  private getModalPosition(): React.CSSProperties {
    const {targetRect, width, isVisible, step} = this.props;
    const {position} = step;

    const padding = 5;
    const defaultWidth = 290;
    const modalWidth = width !== undefined ? width : defaultWidth;

    const modalSide = getPositionSide(position);
    const sideCommonStyle = this.getCommonStyleForSide(modalSide, targetRect, padding, modalWidth);
    const modalTransformStyle = this.getModalTransformForPosition(position, isVisible);
    const modalStyles: React.CSSProperties = {
      ...sideCommonStyle,
      transform: modalTransformStyle,
      width: `${modalWidth}px`,
    };
    const sideCenterStyles: React.CSSProperties = {
      top: targetRect.top + targetRect.height / 2,
      alignItems: "center",
    };

    switch (position) {
      case TourModalPosition.RIGHT_TOP:
        return {
          ...modalStyles,
          top: targetRect.top,
        };
      case TourModalPosition.RIGHT_BOTTOM:
        return {
          ...modalStyles,
          top: targetRect.top + targetRect.height,
          alignItems: "flex-end",
        };
      case TourModalPosition.RIGHT_CENTER:
        return {
          ...modalStyles,
          ...sideCenterStyles,
        };
      case TourModalPosition.LEFT_TOP:
        return {
          ...modalStyles,
          top: targetRect.top,
        };
      case TourModalPosition.LEFT_BOTTOM:
        return {
          ...modalStyles,
          top: targetRect.top + targetRect.height,
          alignItems: "flex-end",
        };
      case TourModalPosition.LEFT_CENTER:
        return {
          ...modalStyles,
          ...sideCenterStyles,
        };
      case TourModalPosition.BOTTOM_CENTER:
        return {
          ...modalStyles,
          left: targetRect.left + targetRect.width / 2,
          alignItems: "center",
        };
      default:
        break;
    }

    return styles;
  }

  private getCommonStyleForSide(
    modalSide: ModalPositionSide,
    targetRect: ClientRect,
    padding: number,
    modalWidth: number,
  ): React.CSSProperties {
    switch (modalSide) {
      case ModalPositionSide.BOTTOM:
        return {
          top: targetRect.top + targetRect.height + padding,
          flexDirection: "column-reverse",
        };
      case ModalPositionSide.LEFT:
        return {
          left: targetRect.left - modalWidth - padding,
        };
      case ModalPositionSide.RIGHT:
        return {
          left: targetRect.left + targetRect.width + padding,
          flexDirection: "row-reverse",
        };
    }
  }

  private getModalTransformForPosition(position: TourModalPosition, isVisible: boolean): string {
    const rotation = 8;
    const translation = 10;
    const perspective = 400;

    switch (position) {
      case TourModalPosition.RIGHT_TOP:
        return isVisible
          ? "translate(0, 0) perspective(0px)"
          : `translate(${translation}px, 0) perspective(${perspective}px) rotateY(${rotation}deg)`;
      case TourModalPosition.RIGHT_BOTTOM:
        return isVisible
          ? "translate(0, -100%) perspective(0px)"
          : `translate(-${translation}px, -100%) perspective(${perspective}px) rotateY(${rotation}deg)`;
      case TourModalPosition.RIGHT_CENTER:
        return isVisible
          ? `translate(0, -50%) perspective(0px)`
          : `translate(${translation}px, -50%) perspective(${perspective}px) rotateY(${rotation}deg)`;
      case TourModalPosition.LEFT_TOP:
        return isVisible
          ? "translate(0, 0) perspective(0px)"
          : `translate(-${translation}px, 0) perspective(${perspective}px) rotateY(-${rotation}deg)`;
      case TourModalPosition.LEFT_BOTTOM:
        return isVisible
          ? "translate(0, -100%) perspective(0px)"
          : `translate(-${translation}px, -100%) perspective(${perspective}px) rotateY(-${rotation}deg)`;
      case TourModalPosition.LEFT_CENTER:
        return isVisible
          ? "translate(0, -50%) perspective(0px)"
          : `translate(-${translation}px, -50%) perspective(${perspective}px) rotateY(-${rotation}deg)`;
      case TourModalPosition.BOTTOM_CENTER:
        return isVisible
          ? "translate(-50%, 0) perspective(0px)"
          : `translate(-50%, ${translation}px) perspective(${perspective}px) rotateX(-${rotation}deg)`;
      default:
        return "";
    }
  }

  private getArrowStyle(modalSide: ModalPositionSide): React.CSSProperties {
    const {targetRect, step} = this.props;
    const {position} = step;

    const arrowHalfHeight = 8;
    const commonStyle = this.getArrowCommonStyleForSide(modalSide);

    switch (position) {
      case TourModalPosition.RIGHT_TOP:
        const arrowPadding = targetRect.height / 2 - arrowHalfHeight;
        return {
          ...commonStyle,
          paddingTop: arrowPadding,
        };
      case TourModalPosition.RIGHT_CENTER:
      case TourModalPosition.RIGHT_BOTTOM:
        return commonStyle;
      case TourModalPosition.LEFT_TOP:
        return {
          ...commonStyle,
          paddingTop: targetRect.height / 2 - arrowHalfHeight,
        };
      case TourModalPosition.LEFT_CENTER:
      case TourModalPosition.LEFT_BOTTOM:
        return commonStyle;
      case TourModalPosition.BOTTOM_CENTER:
        return commonStyle;
      default:
        break;
    }

    return {};
  }

  private getArrowCommonStyleForSide(side: ModalPositionSide): React.CSSProperties {
    const verticalMargin = -13;
    const horizontalMargin = -10;

    switch (side) {
      case ModalPositionSide.BOTTOM:
        return {
          marginBottom: verticalMargin,
        };
      case ModalPositionSide.LEFT:
        return {
          marginLeft: horizontalMargin,
        };
      case ModalPositionSide.RIGHT:
        return {
          marginRight: horizontalMargin,
        };
    }
  }

  private getButtonText(buttonType: ButtonType) {
    const {globalButtonsTexts, step} = this.props;
    const stepButtonsTexts = step.buttonsTexts;

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

export const TourModal: React.ComponentClass<IOuterProps> = compose<ITemplateProps, IOuterProps>(
  setDisplayName("TourModal"),
)(Template);
