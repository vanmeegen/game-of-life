// lib imports
import * as React from "react";
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
  boardRow: boolean[];
}

export class CellRow extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: LocalProps): boolean {
    return nextProps.x !== this.props.x || nextProps.y !== this.props.y || nextProps.cellSize !== this.props.cellSize || nextProps.row !== this.props.row || !deepEqual(nextProps.boardRow, this.props.boardRow);
  }

  render(): JSX.Element {
    const svgElements: JSX.Element[] = [];
    for (let x = 0; x < this.props.x; x++) {
      svgElements.push(<rect key={x} x={x * this.props.cellSize + 1}
                             y={this.props.row * this.props.cellSize + 1}
                             width={this.props.cellSize - 2} height={this.props.cellSize - 2}
                             className={this.props.boardRow[x] ? "field-filled" : "field-empty"}/>);
    }
    return <g>
      {svgElements}
    </g>;
  }
}

