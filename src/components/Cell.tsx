// lib imports
import * as React from "react";
import {observer} from "mobx-react";
import {BoardEntryType} from "../stores/modelstore";
import log from "../Logger";
import ReactElement = React.ReactElement;
import ReactNode = React.ReactNode;

/**
 * draw a cell of a grid
 * @author Marco van Meegen
 */
interface LocalProps {
  cellSize: number;
  x: number;
  y: number;
  boardEntry: BoardEntryType;
}

@observer
export class Cell extends React.Component<LocalProps, any> {
  constructor(props: LocalProps) {
    super(props);
  }

  render(): JSX.Element {
    log.debug("Rendering Cell " + this.props.x + "," + this.props.y);
    return <rect x={this.props.x * this.props.cellSize + 1} y={this.props.y * this.props.cellSize + 1}
                 width={this.props.cellSize - 2} height={this.props.cellSize - 2}
                 className={this.props.boardEntry.isAlive ? "field-filled" : "field-empty"}/>;
  }
}

