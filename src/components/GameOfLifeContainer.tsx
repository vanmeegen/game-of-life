import "../app.css";
import * as React from "react";
import log from "../Logger";
import {BoardType} from "../stores/ModelStore";
import {HeaderBarComponent} from "./HeaderBarComponent";

interface LocalProps {

}

interface LocalState {
  board: BoardType; /** board to display */
  size: number; /** size of board */
  scale: number;
}

// App component
export class GameOfLifeContainer extends React.Component<any, LocalState> {
  /** padding around svg diagram to enabe moving elements outside of original bounds of container */
  private static PADDING_WIDTH: number = 50;

  constructor(props: LocalProps) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.initRandom = this.initRandom.bind(this);
    this.nextGeneration = this.nextGeneration.bind(this);
    this.startInfinite = this.startInfinite.bind(this);
    this.changeSize = this.changeSize.bind(this);
    this.state = {board: [], size: 10, scale: 1};
  }

  render(): JSX.Element {
    log.debug("Rendering Game of Life");

    // layout with fixed header from here: http://stackoverflow.com/questions/36515103/scrollable-div-content-area-with-fixed-header
    return <div className="editor">
      <div className="editor-header">
        <HeaderBarComponent title="Game of Live">
          <button type="button" className="btn btn-default btn-xs" onClick={this.initRandom}>Random Life</button>
          <button type="button" className="btn btn-default btn-xs" onClick={this.nextGeneration}>
            Calculate next Generation
          </button>
          <button type="button" className="btn btn-default btn-xs" onClick={this.startInifinite}>
            Start infinite Calculation
          </button>
          <input type="range" min="10" max="1000" value={this.state.size}
                 onChange={this.changeSize} style={{width: "100px"}} className="btn btn-default btn-xs"/>
        </HeaderBarComponent>
      </div>
      <div className="editor-container" ref="containerRef">
        <svg width="100%" height="100%" onMouseDown={this.onMouseDown} ref="svgRef">
          <g className="board">
          </g>
        </svg>
      </div>
    </div>;
  }

  componentDidMount(): void {
    this.updateDimensions();
  }

  componentDidUpdate(): void {
    this.updateDimensions();
  }

  initRandom(): void {
    // TODO
  }

  nextGeneration(): void {
    // TODO
  }

  startInifinite(): void {
    // TODO
  }

  startInfinite(): void {
    // TODO
  }

  private changeSize(evt: any): void {
    const value: number = parseInt(evt.target.value);
    // TODO
  }

  updateDimensions(): void {
    if (this.refs["svgRef"]) {
      // bounding box of all svg elements in canvas should be new size of viewport

      const rect: SVGRect = (this.refs["svgRef"] as any).getBBox();
      // determine container client height and width
      const clientHeight = (this.refs["containerRef"] as any).clientHeight;
      const clientWidth = (this.refs["containerRef"] as any).clientWidth;

      // determine viewport width and height, enlarge by padding width
      // max to enlarge viewport if smaller than available area to fill whole container
      const viewportWidth = Math.max(rect.width + GameOfLifeContainer.PADDING_WIDTH * 2, clientWidth);
      const viewportHeight = Math.max(rect.height + GameOfLifeContainer.PADDING_WIDTH * 2, clientHeight);
      (this.refs["svgRef"] as any).setAttribute("width", viewportWidth * this.state.scale);
      (this.refs["svgRef"] as any).setAttribute("height", viewportHeight * this.state.scale);
    }
  }

  private onMouseDown(e: any): void {
    this.log("mousedown", e);
  }

  // /**
  //  *
  //  * @param e event
  //  * @returns node id associated with current svg element (= attribute data-nodeid) or {null} if none found
  //  */
  // private  getNodeId(e: any): number {
  //   let result = null;
  //   let element = e.target;
  //   while ((result = element.getAttribute("data-nodeid")) == null && element.parentNode && element.parentNode.getAttribute) {
  //     element = element.parentNode;
  //   }
  //   if (result) {
  //     try {
  //       result = Number.parseInt(result);
  //     } catch (ex) {
  //       log.error("element id should be a number, found:", result);
  //       result = null;
  //     }
  //   }
  //   log.trace("getNodeId", e.target, result);
  //   return result;
  // }

  private  log(evtName: string, e: any): void {
    log.trace(evtName, e.target);
  }
}

