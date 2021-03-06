// lib imports
import * as React from "react";
import log from "../Logger";
import {Cell} from "./cell";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;
import deepEqual = require("deep-equal");

/**
 * draw a grid
 * @author Marco van Meegen
 */
interface LocalProps {
  cellSize: number;
  maxX: number;
  maxY: number;
  y: number;
  boardRow: Array<boolean>;
}

export class CellRow extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: LocalProps): boolean {
    return !deepEqual(nextProps, this.props);
  }

  render(): JSX.Element {
    log.debug("Rendering CellRow " + this.props.y);
    return <g>
      { this.props.boardRow.map((entry, x) =>
          <Cell key={x + this.props.maxX * this.props.y} x={x} y={this.props.y} cellSize={this.props.cellSize}
                alive={entry}/>)
      }
    </g>;
  }
}

