// lib imports
import * as React from "react";
import {CellRow} from "./cellrow";
import {Board} from "../stores/ModelStore";
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
  board: Board;
}

@observer
export class CellGrid extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  render(): JSX.Element {
    log.debug("Rendering CellGrid");
    const svgElements: JSX.Element[] = [];
    // create field contents
    for (let y = 0; y < this.props.board.maxY; y++) {
      svgElements.push(<CellRow key={y} cellSize={this.props.cellSize} maxX={this.props.board.maxX}
                                maxY={this.props.board.maxY} y={y}
                                boardRow={this.props.board.cells[y]}/>);
    }
    return <g>
      {svgElements}
    </g>;
  }
}

