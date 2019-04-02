import * as cx from "classnames";
import * as React from "react";
import {compose, setDisplayName} from "recompose";
import * as styles from "./styles.scss";

export interface IOuterProps {
  label?: string;
  color?: string;
  hoverColor?: string;
  textColor?: string;
  textHoverColor?: string;
  className?: string;
  onClick?: () => void;
}

interface ITemplateState {
  isHovered: boolean;
}
/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

class Template extends React.PureComponent<ITemplateProps, ITemplateState> {
  public state: ITemplateState = {
    isHovered: false,
  };

  public render() {
    const {label, className, onClick} = this.props;

    const classNames = cx(styles.Button, className);

    return (
      <button
        title={label}
        className={classNames}
        onClick={onClick}
        type={"button"}
        style={this.getStyles()}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      >
        <span className={styles.label}>{label}</span>
      </button>
    );
  }

  // Handlers

  private hoverOn = () => {
    this.setState({isHovered: true});
  };

  private hoverOff = () => {
    this.setState({isHovered: false});
  };

  // Helpers

  private getStyles(): React.CSSProperties {
    const {color, textColor, hoverColor, textHoverColor} = this.props;
    const {isHovered} = this.state;

    const bgColor = this.getColor(color, "#0b71e6");
    const txtColor = this.getColor(textColor, "#fff");

    const bgHoverColor = this.getColor(hoverColor, "#0b76f0");
    const txtHoverColor = this.getColor(textHoverColor, "#fff");

    if (isHovered) {
      return {
        backgroundColor: bgHoverColor,
        color: txtHoverColor,
      };
    } else {
      return {
        backgroundColor: bgColor,
        color: txtColor,
      };
    }
  }

  private getColor(requested: string | undefined, defaultColor: string) {
    if (requested) {
      return requested;
    } else {
      return defaultColor;
    }
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const Button = compose<ITemplateProps, IOuterProps>(setDisplayName("Button"))(Template);
