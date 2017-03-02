// lib imports
import * as React from "react";
import ReactElement = React.ReactElement;

/**
 * create an editor title and a menu bar, menu entries are addes as children
 * @author Marco van Meegen
 */
interface LocalEdgesProps {
  title: string;
}

export class HeaderBarComponent extends React.Component<LocalEdgesProps, any> {
  constructor(props: LocalEdgesProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.children !== this.props.children;
  }

  render() {
    return      <div className="editor-bar">
      <h3 className="editor-title">{this.props.title}</h3>
      <div className="editor-menu btn-group" role="group">
        {this.props.children}
      </div>
    </div>;

  }
}

