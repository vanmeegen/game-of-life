// lib imports
import * as React from "react";
import log from "../Logger";
import {observer} from "mobx-react";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;
const shallowequal = require("shallowequal");

/**
 * draw a grid
 * @author Marco van Meegen
 */
interface LocalProps {
  cellSize: number;
  x: number;
  y: number;
}

@observer
export class Grid extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: LocalProps): boolean {
    return !shallowequal(nextProps, this.props);
  }

  render(): JSX.Element {
    log.debug("Rendering Grid");
    const svgElements: JSX.Element[] = [];
    // create vertical lines
    for (let x = 0; x < this.props.x; x++) {
      svgElements.push(<line key={"vert" + x} x1={x * this.props.cellSize} y1={0} x2={x * this.props.cellSize}
                             y2={this.props.y * this.props.cellSize} className="board-grid"/>);
    }
    // create horizontal lines
    for (let y = 0; y < this.props.y; y++) {
      svgElements.push(<line key={"hor" + y} x1={0} y1={y * this.props.cellSize} x2={this.props.x * this.props.cellSize}
                             y2={y * this.props.cellSize} className="board-grid"/>);
    }

    return <g>
      <rect x="0" y="0" width={this.props.x * this.props.cellSize - 1}
            height={this.props.y * this.props.cellSize - 1}
            className="board-border"/>
      {svgElements}
    </g>;
  }
}

