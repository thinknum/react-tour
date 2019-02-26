import * as React from "react";
import * as ReactDOM from 'react-dom';
import { compose } from "recompose";

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  id?: string;
  children: React.ReactNode | React.ReactNode[];
}

/* Template
-------------------------------------------------------------------------*/

type ITemplateProps = IOuterProps;

class Template extends React.PureComponent<ITemplateProps> {

  private node: HTMLElement;

  constructor(props: any) {
    super(props);

    this.node = document.createElement('div');
    if (props.id) {
      this.node.id = props.id;
    }

    document.body.appendChild(this.node);
  }

  public componentWillUnmount() {
    document.body.removeChild(this.node);
  }

  public render() {
    const {children} = this.props;

    return ReactDOM.createPortal(children, this.node);
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const Portal = compose<ITemplateProps, IOuterProps>(
)(Template);
