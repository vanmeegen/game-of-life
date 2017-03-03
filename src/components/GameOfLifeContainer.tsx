import "./app.css";
import * as React from "react";
import log from "../Logger";
import modelStore, {BoardType} from "../stores/ModelStore";
import {HeaderBarComponent} from "./HeaderBarComponent";
import {initRandom, next, clear, set, size} from "../actions/ActionCreator";
import {Point} from "../util/Geometry";
import {Configuration} from "../common/Configuration";

interface LocalProps {

}

interface LocalState {
  board: BoardType; /** board to display */
  size: number; /** size of board */
  cellSize: number; /** cell size to draw in pixel */
}

// App component
export class GameOfLifeContainer extends React.Component<any, LocalState> {
  /** padding around svg diagram to enabe moving elements outside of original bounds of container */
  private static PADDING_WIDTH: number = 10;

  /** flag if running infinite loop of generations */
  private infinite: boolean = false;

  constructor(props: LocalProps) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.initRandom = this.initRandom.bind(this);
    this.nextGeneration = this.nextGeneration.bind(this);
    this.startInfinite = this.startInfinite.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
    this.changeCellSize = this.changeCellSize.bind(this);
    this.clear = this.clear.bind(this);
    this.storeChanged = this.storeChanged.bind(this);
    this.autoGeneration = this.autoGeneration.bind(this);
    this.stop = this.stop.bind(this);
    this.state = {board: [], size: 0, cellSize: 10};
  }

  componentWillMount(): void {
    modelStore.register(this.storeChanged);
    this.storeChanged();
  }

  componentDidMount(): void {
    this.updateDimensions();
  }

  componentDidUpdate(): void {
    this.updateDimensions();
  }

  componentWillUnmount(): void {
    modelStore.deregister(this.storeChanged);
  }

  storeChanged(): void {
    if (modelStore.dimensions.x !== this.state.size) {
      this.setState({...this.state, size: modelStore.dimensions.x});
    } else {
      this.forceUpdate();
    }
  }

  render(): JSX.Element {
    log.debug("Rendering Game of Life");
    const svgElements: JSX.Element[] = [];
    // create field contents
    const maxX = this.state.size;
    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < modelStore.dimensions.y; y++) {
        svgElements.push(<rect key={x + y * maxX} x={x * this.state.cellSize + 1} y={y * this.state.cellSize + 1}
                               width={this.state.cellSize - 2} height={this.state.cellSize - 2}
                               className={modelStore.board(x, y).isAlive ? "field-filled" : "field-empty"}/>);
      }
    }
    // create vertical lines
    for (let x = 0; x < maxX; x++) {
      svgElements.push(<line key={"vert" + x} x1={x * this.state.cellSize} y1={0} x2={x * this.state.cellSize}
                             y2={modelStore.dimensions.y * this.state.cellSize} className="board-grid"/>);
    }
    // create horizontal lines
    for (let y = 0; y < modelStore.dimensions.y; y++) {
      svgElements.push(<line key={"hor" + y} x1={0} y1={y * this.state.cellSize} x2={maxX * this.state.cellSize}
                             y2={y * this.state.cellSize} className="board-grid"/>);
    }

    // layout with fixed header from here: http://stackoverflow.com/questions/36515103/scrollable-div-content-area-with-fixed-header
    return <div
        className="editor">
      <div className="editor-header" onKeyPress={this.stop}>
        <HeaderBarComponent title="Game of Life" fpsId="fps"
                            tooltip={`Version: ${Configuration.version()} commit: ${Configuration.revision()} build time: ${Configuration.BUILD_TIME}`}>
          <button type="button" className="btn btn-default btn-s" onClick={this.clear}>Clear</button>
          <button type="button" className="btn btn-default btn-s" onClick={this.initRandom}>Random</button>
          <button type="button" className="btn btn-default btn-s" onClick={this.nextGeneration}>
            Next Gen
          </button>
          <button type="button" className="btn btn-default btn-s" onClick={this.startInfinite}>
            Run
          </button>
          <div className="btn btn-default btn-s">
            <label htmlFor="boardColumns" className="slider-label">Columns: ({this.state.size})</label>

            <input type="range" min="10" max="500" value={this.state.size} name="boardColumns"
                   title="number of board columns"
                   onChange={this.changeBoardSize}/>
          </div>
          <div className="btn btn-default btn-s">
            <label htmlFor="cellSize" className="slider-label">Cell: ({this.state.cellSize})</label>
            <input type="range" min="3" max="30" value={this.state.cellSize} name="cellSize" title="pixel per cell"
                   onChange={this.changeCellSize}/>
          </div>
        </HeaderBarComponent>
      </div>
      < div className="editor-container" ref="containerRef">
        <svg width="100%" height="100%" onMouseDown={this.onMouseDown} ref="svgRef">
          <g>
            {svgElements}
            <rect x="0" y="0" width={maxX * this.state.cellSize - 1}
                  height={modelStore.dimensions.y * this.state.cellSize - 1}
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
    this.infinite = true;
    requestAnimationFrame(this.autoGeneration);
    // update fps every second
    const fpsOut = document.getElementById("fps");
    setInterval(() => fpsOut.innerHTML = (1000 / this.totalFrameTime).toFixed(1) + " fps", 1000);
  }

  // The higher this value, the less the fps will reflect temporary variations
// A value of 1 will only keep the last value
  private filterStrength: number = 20;
  private totalFrameTime: number = 0;
  private lastGenerationTime: Date = new Date;

  autoGeneration(): void {
    if (this.infinite) {
      const thisGenerationTime = new Date;
      next();

      const thisFrameTime: number = (thisGenerationTime.getTime() - this.lastGenerationTime.getTime());
      this.totalFrameTime += (thisFrameTime - this.totalFrameTime) / this.filterStrength;
      this.lastGenerationTime = thisGenerationTime;
    }
    requestAnimationFrame(this.autoGeneration);
  }

  private changeBoardSize(evt: any): void {
    const value: number = parseInt(evt.target.value);
    size(value);
  }

  private changeCellSize(evt: any): void {
    const value: number = parseInt(evt.target.value);
    this.setState({...this.state, cellSize: value});
  }

  updateDimensions(): void {
    if (this.refs["svgRef"]) {
      // bounding box of all svg elements in canvas should be new size of viewport

      const rect: SVGRect = (this.refs["svgRef"] as any).getBBox();

      // determine viewport width and height, enlarge by padding width
      const viewportWidth = rect.width + GameOfLifeContainer.PADDING_WIDTH * 2;
      const viewportHeight = rect.height + GameOfLifeContainer.PADDING_WIDTH * 2;
      const viewBoxString: string = `${-GameOfLifeContainer.PADDING_WIDTH} ${-GameOfLifeContainer.PADDING_WIDTH} ${viewportWidth - GameOfLifeContainer.PADDING_WIDTH} ${viewportHeight - GameOfLifeContainer.PADDING_WIDTH}`;
      (this.refs["svgRef"] as any).setAttribute("viewBox", viewBoxString);
      (this.refs["svgRef"] as any).setAttribute("width", viewportWidth);
      (this.refs["svgRef"] as any).setAttribute("height", viewportHeight);
    }
  }

  private stop(): boolean {
    if (this.infinite) {
      this.infinite = false;
      return true;
    }
    return false;
  }

  private onMouseDown(e: any): void {
    this.log("mousedown", e);
    if (!this.stop()) {
      const {x, y}: Point = this.getBoardCoordinates(e);
      if (x >= 0 && x < this.state.size && y >= 0 && y < modelStore.dimensions.y) {
        const newValue = !modelStore.board(x, y).isAlive;
        set(x, y, newValue);
      }
    }
  }

  private getBoardCoordinates(e: any): Point {
    const cpt = this.convertClientToSVG(e.clientX, e.clientY);
    return new Point(Math.floor(cpt.x / this.state.cellSize), Math.floor(cpt.y / this.state.cellSize));
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

  private log(evtName: string, e: any): void {
    log.trace(evtName, e.target);
  }
}

