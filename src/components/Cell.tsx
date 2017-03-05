// lib imports
import * as React from "react";
import {LifeCell} from "../stores/modelstore";
import log from "../Logger";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;
const shallowequal = require("shallowequal");

/**
 * draw a cell of a grid
 * @author Marco van Meegen
 */
interface LocalProps {
  cellSize: number;
  x: number;
  y: number;
  boardEntry: LifeCell;
}

export class Cell extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: LocalProps): boolean {
    return !shallowequal(nextProps, this.props);
  }

  render(): JSX.Element {
    log.debug("Rendering Cell " + this.props.x + "," + this.props.y);
    return <rect x={this.props.x * this.props.cellSize + 1} y={this.props.y * this.props.cellSize + 1}
                 width={this.props.cellSize - 2} height={this.props.cellSize - 2}
                 className={this.props.boardEntry.alive ? "field-filled" : "field-empty"}/>;
  }
}

