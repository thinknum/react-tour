import * as cx from "classnames";
import * as React from "react";
import { compose, setDisplayName } from "recompose";
import * as styles from "./styles.scss";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  x: number;
  y: number;
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

interface ITemplateState {
  isVisible: boolean;
}

class Template extends React.PureComponent<ITemplateProps, ITemplateState> {

  public state: ITemplateState = {
    isVisible: false,
  }

  public componentDidMount() {
    this.setState({isVisible: true});
  }

  public render() {
    const {isVisible} = this.state;
    const {x, y} = this.props;

    console.log("X: ", x);
    console.log("Y: ", y);

    return (
      <div className={cx(styles.TourModal, {[styles.isVisible]: isVisible})}>Check this OUT!!!</div>
    );
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const TourModal = compose<ITemplateProps, IOuterProps>(
  setDisplayName("TourModal"),
)(Template);
