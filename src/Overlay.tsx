import * as React from "react";
import { compose } from "recompose";
import * as styles from "./styles.scss";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  id?: string;
  target: string;
  onClick?: () => void;
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

class Template extends React.PureComponent<ITemplateProps> {

  // Properties

  private resizeTimeout: any;

  // Lifecycle

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  public render() {
    return (
      <div className={styles.Overlay} onClick={this.handleOverlayClick}></div>
    );
  }

  // Event handlers

  private handleResize = () => {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      clearTimeout(this.resizeTimeout);
      this.forceUpdate();
    }, 100);
  };

  private handleOverlayClick = (ev: any) => {
    const {onClick} = this.props;
    if (onClick) {
      onClick();
    }
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const Overlay = compose<ITemplateProps, IOuterProps>(
)(Template);
