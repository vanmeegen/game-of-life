/**
 * Created by Marco on 03.03.2017.
 */
// lib imports
import * as React from "react";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;

/**
 * show an unmanaged label with the current frame rate
 * @author Marco van Meegen
 */
interface LocalProps {
  id: string;
}

export class FPSMeter extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: LocalProps): boolean {
    // will be managed directly in DOM
    return false;
  }

  render(): JSX.Element {
    return <h6 style={{ margin: "5px", display: "inline-block" }}>FPS
      <span className="label label-default" style={{ marginLeft: "5px" }} id={this.props.id}>0</span>
    </h6>;
  }
}

