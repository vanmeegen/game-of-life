// lib imports
import * as React from "react";
import {FPSMeter} from "./FPSMeter";
import {observer} from "mobx-react";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;

/**
 * create an editor title and a menu bar, menu entries are addes as children
 * @author Marco van Meegen
 */
interface LocalProps {
  title: string;
  fpsId: string;
  tooltip?: string;
  children?: ReactNode;

}

@observer
export class HeaderBarComponent extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  render(): JSX.Element {
    return      <div className="editor-bar" title={this.props.tooltip || "unknown"}>
      <div>
        <h3 className="editor-title">{this.props.title}</h3>
        <a href="http://www.mvmsoft.de"
           style={{display: "inline-block", marginLeft: "5px"}}>Author: Marco van Meegen</a>
        <FPSMeter id={this.props.fpsId}/>
      </div>
      <div className="editor-menu btn-group" role="group">
        {this.props.children}
      </div>
    </div>;

  }
}

