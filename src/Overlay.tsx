import * as React from "react";
import { compose } from "recompose";
import { getClientRect, getElement } from "./helpers";
import * as styles from "./styles.scss";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  id?: string;
  target: string;
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

class Template extends React.PureComponent<ITemplateProps> {

  private resizeTimeout: any;

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      clearTimeout(this.resizeTimeout);
      this.forceUpdate();
    }, 100);
  };


  private stylesSpotlight = () => {
    const {target} = this.props;

    const spotlightPadding = 10;

    const element = getElement(target);
    if (!element) {
      return {};
    }
    const elementRect = getClientRect(element);

    return {
      borderRadius: 4,
      position: 'absolute' as 'absolute',
      backgroundColor: 'gray',
      height: Math.round(elementRect.height + spotlightPadding * 2),
      left: Math.round(elementRect.left - spotlightPadding),
      opacity: 1,
      // pointerEvents: spotlightClicks ? 'none' : 'auto',
      top: Math.round(elementRect.top - spotlightPadding),
      transition: 'opacity 0.2s',
      width: Math.round(elementRect.width + spotlightPadding * 2),
    };
  }

  render() {
    const spotlight = (
      <div className="tour__spotlight" style={this.stylesSpotlight()} />
    );

    return (
      <div className={styles.Overlay} onClick={() => {}}>
        {spotlight}
      </div>
    );
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const Overlay = compose<ITemplateProps, IOuterProps>(
)(Template);
