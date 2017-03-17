import {Action} from "../actions/Action";
import StoreBase from "./StoreBase";
import log from "../Logger";
import {Point} from "../util/Geometry";
import {observable, action} from "mobx";

// split array into rows to make it faster
function getLifeCell(cells: boolean[][], x: number, y: number): boolean {
  return cells[y][x];
}

function setLifeCell(cells: boolean[][], x: number, y: number, newContent: boolean): void {
  cells[y][x] = newContent;
}


export class Board {
  @observable public maxX: number;
  @observable public maxY: number;
  @observable public cells: boolean[][];
  private readonly NEIGHBOR_OFFSETS: Point[] = [new Point(-1, -1), new Point(-1, 0), new Point(-1, 1), new Point(0, -1), new Point(0, 1), new Point(1, -1), new Point(1, 0), new Point(1, 1)];
  private neighbors: number[];


  constructor(maxX: number, maxY: number) {
    this.initSize(maxX, maxY).initEmpty();
  }

  @action set(x: number, y: number, value: boolean): void {
    if (getLifeCell(this.cells, x, y) !== value) {
      setLifeCell(this.cells, x, y, value);
    }
    this.adjustNeighbors(x, y, value ? 1 : -1);
  }

  /**
   * adjust all neighbor counts of the given life by adding delta
   * @param x xpos of life to adjust
   * @param y ypos of life to adjust
   * @param delta +/- 1 neighbor to adjust
   */
  private adjustNeighbors(x: number, y: number, delta: number): void {
    for (const d of this.NEIGHBOR_OFFSETS) {
      const nx = x + d.x;
      const ny = y + d.y;
      if (nx >= 0 && nx < this.maxX && ny >= 0 && ny < this.maxY) {
        this.neighbors[this.index(nx, ny)] += delta;
      }
    }
  }

  /**
   * initializes cell with randomly set life
   */
  @action
  public initRandom(): void {
    this.init(() => Math.random() < 0.3);
  }

  @action
  public initPentomino(): void {
    const shape = [[1, 0], [2, 0], [1, 1], [1, 2], [0, 1]];
    this.initEmpty();
    const gridStep = 40;
    for (let y = gridStep / 2; y < this.maxX; y += gridStep) {
      for (let x = gridStep / 2; x < this.maxX; x += gridStep) {
        shape.forEach(([dx, dy]) => this.set(x + dx, y + dy, true));
      }
    }
  }
  /**
   * initializes cell with regular pattern for better reproducability
   */
  @action
  public initRegular(): void {
    this.init((x, y) => (x + this.maxX * y) % 3 === 0);
  }

  @action
  public initEmpty(): void {
    this.init(() => false);
  }

  private init(callback: (x?: number, y?: number) => boolean): void {
    this.neighbors.fill(0);
    for (let y = 0; y < this.maxX; y++) {
      for (let x = 0; x < this.maxX; x++) {
        const newLife = callback(x, y);
        if (newLife) {
          this.adjustNeighbors(x, y, 1);
        }
        setLifeCell(this.cells, x, y, newLife);
      }
    }
  }


  /**
   * calculate next life generation in cell
   */
  @action
  public calculateNextGeneration(): void {
    const lastNeighbors: number[] = this.neighbors.slice(0);
    for (let y = 0; y < this.maxX; y++) {
      for (let x = 0; x < this.maxX; x++) {
        const nc = lastNeighbors[this.index(x, y)];
        const isAlive = getLifeCell(this.cells, x, y);
        if (isAlive && (nc < 2 || nc > 3)) {
          // < 2 || > 3 neighbors --> died
          setLifeCell(this.cells, x, y, false);
          this.adjustNeighbors(x, y, -1);
        } else if (!isAlive && nc === 3) {
          // === 3 neighbors -> born
          setLifeCell(this.cells, x, y, true);
          this.adjustNeighbors(x, y, 1);
        }
      }
    }
  }

  public cell(x: number, y: number): boolean {
    return getLifeCell(this.cells, x, y);
  }

  public neighborCount(x: number, y: number): number {
    return this.neighbors[this.index(x, y)];
  }


  private index(x: number, y: number): number {
    return x + this.maxX * y;
  }

  public initSize(x: number, y: number): Board {
    this.maxX = x;
    this.maxY = y;
    this.neighbors = new Array(x * y).fill(0);
    const dummy = new Array(x);
    const list: boolean[][] = new Array(y).fill(dummy);
    list.forEach((row, index) => {
      list[index] = new Array(x);
    });
    this.cells = list;
    return this;
  }
}

export class ModelStore extends StoreBase {

  private _board: Board;
  private static DEFAULT_SIZE: number = 150;

  constructor() {
    super();
    this._board = new Board(ModelStore.DEFAULT_SIZE, ModelStore.DEFAULT_SIZE);
  }

  public cell(x: number, y: number): boolean {
    return this._board.cell(x, y);
  }

  public neighborCount(x: number, y: number): number {
    return this._board.neighborCount(x, y);
  }

  public get board(): Board {
    return this._board;
  }

  accept(action: Action): void {
    log.debug("ModelStore accepting", action);
    switch (action.type) {
      case "clear":
        this._board.initEmpty();
        break;
      case "initRandom":
        this._board.initRandom();
        break;
      case "initPentomino":
        this._board.initPentomino();
        break;
      case "initRegular":
        this._board.initRegular();
        break;
      case "size":
        this._board.initSize(action.payload, action.payload).initEmpty();
        break;
      case "next":
        this._board.calculateNextGeneration();
        break;
      case "set":
        const {x, y, value} = action.payload;
        this._board.set(x, y, value);
    }
    this.notify(action.type);
  }
}

export default new ModelStore();