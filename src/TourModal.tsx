import * as cx from "classnames";
import * as React from "react";
import { compose, setDisplayName } from "recompose";
import { TourModalPosition } from ".";
import { Button } from "./Button";
import * as styles from "./styles.scss";

export interface ButtonsTexts {
  nextButtonText?: string;
  skipButtonText?: string;
  finishButtonText?: string;
}

enum ButtonType {
  SKIP = 0,
  NEXT = 1,
  FINISH = 2
}

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  buttonsTexts?: ButtonsTexts;
  hasNext: boolean;
  targetRect: ClientRect,
  position: TourModalPosition,
  isVisible: boolean;
  title?: string;
  content?: string;
  onSkipClicked?: () => void;
  onNextClicked?: () => void;
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
        className={cx(styles.TourModal, {[styles.isVisible]: isVisible})}
        style={positionStyle}
      >
        {title !== undefined ? (
          <h3>{title}</h3>
        ) : null}

        {content !== undefined ? (
          <p>{content}</p>
        ) : null}

        <div className={styles.actions}>
          <Button
            label={this.getButtonText(ButtonType.SKIP)}
            color={"transparent"}
            hoverColor={"transparent"}
            textColor="#96a4b3"
            textHoverColor="#798796"
            onClick={this.handleSkipClick}
            className={styles.skip}
          />
          <Button
            label={this.getButtonText(hasNext ? ButtonType.NEXT : ButtonType.FINISH)}
            onClick={this.handleNextClick}
          />
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
  }

  private handleNextClick = () => {
    const {onNextClicked} = this.props;

    if (onNextClicked) {
      onNextClicked();
    }
  }

  // Helpers

  private getModalPosition(): React.CSSProperties {
    const {targetRect, position} = this.props;

    const padding = 15;

    switch (position) {
      case TourModalPosition.RIGHT_TOP:
        return {
          top: targetRect.top + targetRect.height + padding,
          left: targetRect.left,
        }
      default:
        break;
    }

    return {};
  }

  private getButtonText(buttonType: ButtonType) {
    const {buttonsTexts} = this.props;

    switch (buttonType) {
      case ButtonType.SKIP:
        if (buttonsTexts && buttonsTexts.skipButtonText) {
          return buttonsTexts.skipButtonText;
        } else {
          return "Skip";
        }
      case ButtonType.NEXT:
        if (buttonsTexts && buttonsTexts.nextButtonText) {
          return buttonsTexts.nextButtonText;
        } else {
          return "Next";
        }
      case ButtonType.SKIP:
        if (buttonsTexts && buttonsTexts.finishButtonText) {
          return buttonsTexts.finishButtonText;
        } else {
          return "Finish";
        }
      default:
        return "";
    }
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const TourModal = compose<ITemplateProps, IOuterProps>(
  setDisplayName("TourModal"),
)(Template);
