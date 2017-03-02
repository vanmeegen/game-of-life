import "./app.css";
import * as React from "react";
import log from "../Logger";
import modelStore, {BoardType} from "../stores/ModelStore";
import {HeaderBarComponent} from "./HeaderBarComponent";
import {initRandom, next, clear, set} from "../actions/ActionCreator";
import {Point} from "../util/Geometry";

interface LocalProps {

}

interface LocalState {
  board: BoardType; /** board to display */
  size: number; /** size of board */
}

// App component
export class GameOfLifeContainer extends React.Component<any, LocalState> {
  /** padding around svg diagram to enabe moving elements outside of original bounds of container */
  private static PADDING_WIDTH: number = 10;

  constructor(props: LocalProps) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.initRandom = this.initRandom.bind(this);
    this.nextGeneration = this.nextGeneration.bind(this);
    this.startInfinite = this.startInfinite.bind(this);
    this.changeSize = this.changeSize.bind(this);
    this.clear = this.clear.bind(this);
    this.storeChanged = this.storeChanged.bind(this);
    this.state = {board: [], size: 0};
  }

  componentDidMount(): void {
    modelStore.register(this.storeChanged);
    this.storeChanged();
    this.updateDimensions();
    // TODO: register size listener on container and call updateDimensions
  }

  componentDidUpdate(): void {
    this.updateDimensions();
  }

  componentWillUnmount(): void {
    modelStore.deregister(this.storeChanged);
  }

  storeChanged(): void {
    this.forceUpdate();
  }

  render(): JSX.Element {
    log.debug("Rendering Game of Life");
    const svgElements: JSX.Element[] = [];
    // create field contents
    for (let x = 0; x < modelStore.dimensions.x; x++) {
      for (let y = 0; y < modelStore.dimensions.y; y++) {
        svgElements.push(<rect x={x * 10 + 1} y={y * 10 + 1} width="8" height="8"
                               className={modelStore.board(x, y).isAlive ? "field-filled" : "field-empty"}/>);
      }
    }
    // create vertical lines
    for (let x = 0; x < modelStore.dimensions.x; x++) {
      svgElements.push(<line x1={x * 10} y1={0} x2={x * 10} y2={modelStore.dimensions.y * 10} className="board-grid"/>);
    }
    // create horizontal lines
    for (let y = 0; y < modelStore.dimensions.y; y++) {
      svgElements.push(<line x1={0} y1={y * 10} x2={modelStore.dimensions.x * 10} y2={y * 10} className="board-grid"/>);
    }

    // layout with fixed header from here: http://stackoverflow.com/questions/36515103/scrollable-div-content-area-with-fixed-header
    return <div
        className="editor">
      <div className="editor-header">
        <HeaderBarComponent title="Game of Life">
          <button type="button" className="btn btn-default btn-xs" onClick={this.clear}>Clear Board</button>
          <button type="button" className="btn btn-default btn-xs" onClick={this.initRandom}>Random Life</button>
          <button type="button" className="btn btn-default btn-xs" onClick={this.nextGeneration}>
            Calculate next Generation
          </button>
          {/*<button type="button" className="btn btn-default btn-xs" onClick={this.startInfinite}>*/}
          {/*Start infinite Calculation*/}
          {/*</button>*/}
          {/*<input type="range" min="10" max="1000" value={this.state.size}*/}
          {/*onChange={this.changeSize} style={{width: "100px"}} className="btn btn-default btn-xs"/>*/}
        </HeaderBarComponent>
      </div>
      < div className="editor-container" ref="containerRef">
        <svg width="100%" height="100%" onMouseDown={this.onMouseDown} ref="svgRef">
          <g>
            {svgElements}
            <rect x="0" y="0" width={modelStore.dimensions.x * 10 - 1} height={modelStore.dimensions.y * 10 - 1}
                  className="board-border"/>
          </g>
        </svg>
      </div >
    </div >;
  }

  initRandom(): void {
    initRandom();
  }

  nextGeneration(): void {
    next();
  }

  clear(): void {
    clear();
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
      const viewBoxString: string = `${-GameOfLifeContainer.PADDING_WIDTH} ${-GameOfLifeContainer.PADDING_WIDTH} ${viewportWidth - GameOfLifeContainer.PADDING_WIDTH} ${viewportHeight - GameOfLifeContainer.PADDING_WIDTH}`;
      (this.refs["svgRef"] as any).setAttribute("viewBox", viewBoxString);
      (this.refs["svgRef"] as any).setAttribute("width", viewportWidth);
      (this.refs["svgRef"] as any).setAttribute("height", viewportHeight);
    }
  }

  private onMouseDown(e: any): void {
    this.log("mousedown", e);
    const {x, y}: Point = this.getBoardCoordinates(e);
    if (x >= 0 && x < modelStore.dimensions.x && y >= 0 && y < modelStore.dimensions.y) {
      const newValue = !modelStore.board(x, y).isAlive;
      set(x, y, newValue);
    }
  }

  private getBoardCoordinates(e: any): Point {
    const cpt = this.convertClientToSVG(e.clientX, e.clientY);
    return new Point(Math.floor(cpt.x / 10), Math.floor(cpt.y / 10));
  }

  private  convertClientToSVG(x: number, y: number): Point {
    const svg: SVGSVGElement = (this.refs["svgRef"] as any);
    // convert from screen to matrix coordinates
    const point = svg.createSVGPoint();
    const transform = svg.getScreenCTM().inverse();
    point.x = x;
    point.y = y;
    const transformedPoint = point.matrixTransform(transform);
    return new Point(transformedPoint.x, transformedPoint.y);
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

  private log(evtName: string, e: any): void {
    log.trace(evtName, e.target);
  }
}

