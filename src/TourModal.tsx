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
        className={cx(styles.TourModal, {[styles.isVisible]: isVisible})}
        style={positionStyle}
      >
        <div className={styles.modalBody}>
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

        <div className={styles.arrow} style={this.getArrowStyle()}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='17'>
            <path fillRule='evenodd' fill='#FFF' d='M0.550,7.086 L7.566,0.015 L15.985,8.500 L7.566,16.985 L0.550,9.914 C-0.225,9.133 -0.225,7.867 0.550,7.086 Z'/>
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
  }

  private handleNextClick = () => {
    const {onNextClicked} = this.props;

    if (onNextClicked) {
      onNextClicked();
    }
  }

  // Helpers

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
        }
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
        const arrowPadding = targetRect.height / 2 - arrowHalfHeight
        return {
          marginRight: -10,
          paddingTop: arrowPadding,
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
