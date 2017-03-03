// lib imports
import * as React from "react";
import {CellRow} from "./cellrow";
import {observer} from "mobx-react";
import {Board} from "../stores/ModelStore";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;
import shallowEqual = require("shallowequal");
const deepEqual = require("deep-equal");

/**
 * draw a grid
 * @author Marco van Meegen
 */
interface LocalProps {
  cellSize: number;
  x: number;
  y: number;
  board: Board;
}

@observer
export class CellGrid extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  render(): JSX.Element {
    const svgElements: JSX.Element[] = [];
    // create field contents
    for (let y = 0; y < this.props.y; y++) {
      svgElements.push(<CellRow key={y} cellSize={this.props.cellSize} x={this.props.x} y={this.props.y} row={y}
                                boardRow={this.props.board.cells().slice(this.props.x * y, this.props.x * (y + 1))}/>);
    }
    return <g>
      {svgElements}
    </g>;
  }
}

