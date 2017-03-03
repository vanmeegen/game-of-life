// lib imports
import * as React from "react";
import {observer} from "mobx-react";
import {BoardEntryType} from "../stores/modelstore";
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
  row: number;
  boardRow: BoardEntryType[];
}

@observer
export class CellRow extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  render(): JSX.Element {
    const svgElements: JSX.Element[] = [];
    for (let x = 0; x < this.props.x; x++) {
      svgElements.push(<rect key={x} x={x * this.props.cellSize + 1}
                             y={this.props.row * this.props.cellSize + 1}
                             width={this.props.cellSize - 2} height={this.props.cellSize - 2}
                             className={this.props.boardRow[x].isAlive ? "field-filled" : "field-empty"}/>);
    }
    return <g>
      {svgElements}
    </g>;
  }
}

