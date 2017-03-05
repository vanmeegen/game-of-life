// lib imports
import * as React from "react";
import {LifeCell} from "../stores/modelstore";
import log from "../Logger";
import {Cell} from "./cell";
import {Iterable} from "immutable";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;
const shallowequal = require("shallowequal");

/**
 * draw a grid
 * @author Marco van Meegen
 */
interface LocalProps {
  cellSize: number;
  maxX: number;
  maxY: number;
  y: number;
  boardRow: Iterable<number, LifeCell>;
}

export class CellRow extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: LocalProps): boolean {
    return !shallowequal(nextProps, this.props);
  }

  render(): JSX.Element {
    log.debug("Rendering CellRow " + this.props.y);
    return <g>
      { this.props.boardRow.map((entry, x) =>
          <Cell key={x + this.props.maxX * this.props.y} x={x} y={this.props.y} cellSize={this.props.cellSize}
                boardEntry={entry}/>)
      }
    </g>;
  }
}

