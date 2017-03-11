import {Action} from "../actions/Action";
import StoreBase from "./StoreBase";
import log from "../Logger";
import {observable, action} from "mobx";

export type BoardEntryType = {isAlive: boolean, neighborCount: number, lastNeighborCount?: number};

/**
 * models a Game of Life Board with current neighbor count
 */
export class Board {
  @observable private _cells: BoardEntryType[];
  private NEIGHBOR_OFFSETS: number[];
  @observable public maxX: number;
  @observable public maxY: number;

  constructor() {
    this.init(1, 1);
  }

  @action set(x: number, y: number, value: boolean): void {
    const index = this.index(x, y);
    if (this._cells[index].isAlive !== value) {
      this._cells[index].isAlive = value;
      this.adjustNeighbors(index, value ? 1 : -1);
    }
  }

  /**
   * adjust all neighbor counts of the given life by adding delta
   * @param index
   * @param delta
   */
  adjustNeighbors(index: number, delta: number): void {
    for (const d of this.NEIGHBOR_OFFSETS) {
      const neighborIndex = index + d;
      if (neighborIndex >= 0 && neighborIndex < this.maxX * this.maxY) {
        this._cells[neighborIndex].neighborCount += delta;
      }
    }
  }

  /**
   * initializes cell with randomly set life
   */
  @action
  public initRandom(): void {
    const x = this.maxX;
    const y = this.maxY;
    this.init(x, y);
    for (let i = 0; i < x * y; i++) {
      this._cells[i].isAlive = Math.random() < 0.3;
    }
    for (let i = 0; i < x * y; i++) {
      if (this._cells[i].isAlive) {
        this.adjustNeighbors(i, 1);
      }
    }
  }

  /**
   * initializes cell with regular pattern for better reproducability
   */
  @action
  public initRegular(): void {
    const x = this.maxX;
    const y = this.maxY;
    this.init(x, y);
    for (let i = 0; i < x * y; i++) {
      this._cells[i].isAlive = i % 3 === 0;
    }
    for (let i = 0; i < x * y; i++) {
      if (this._cells[i].isAlive) {
        this.adjustNeighbors(i, 1);
      }
    }
  }

  /**
   * calculate next life generation in cell
   */
  @action
  public calculateNextGeneration(): void {
    // first save all neighborCounts in lastNeighborCount, then
    this._cells.forEach(x => x.lastNeighborCount = x.neighborCount);

    for (let i = 0; i < this.maxX * this.maxY; i++) {
      // if _cells has 2 or 3 neighbors, stay alive
      // if _cells has 3 neighbors, new born

      const nc = this._cells[i].lastNeighborCount;
      const isAlive = this._cells[i].isAlive;
      if (isAlive && (nc < 2 || nc > 3)) {
        // < 2 || > 3 neighbors --> died
        this._cells[i].isAlive = false;
        this.adjustNeighbors(i, -1);
      } else if (!isAlive && nc === 3) {
        // === 3 neighbors -> born
        this._cells[i].isAlive = true;
        this.adjustNeighbors(i, 1);
      }
    }
  }

  public cell(x: number, y: number): BoardEntryType {
    return this._cells[this.index(x, y)];
  }

  @action init(x: number, y: number): void {
    // switch order, otherwise trouble with out of index since cell changes will be triggered, but index does not fit
    this.maxX = x;
    this.maxY = y;
    this._cells = [];
    this.NEIGHBOR_OFFSETS = [-1, -x - 1, -x, -x + 1, 1, x - 1, x, x + 1];
    for (let i = 0; i < x * y; i++) {
      this._cells.push({isAlive: false, neighborCount: 0});
    }
  }

  public cells(): BoardEntryType[] {
    return this._cells;
  }
  private index(x: number, y: number): number {
    return x + this.maxX * y;
  }
}

export class ModelStore extends StoreBase {

  private _board: Board;
  private static DEFAULT_SIZE: number = 75;


  constructor() {
    super();
    this._board = new Board();
    this._board.init(ModelStore.DEFAULT_SIZE, ModelStore.DEFAULT_SIZE);
  }

  public cell(x: number, y: number): BoardEntryType {
    return this._board.cell(x, y);
  }

  public get board(): Board {
    return this._board;
  }

  accept(action: Action): void {
    log.info("ModelStore accepting", action);
    switch (action.type) {
      case "clear":
        this._board.init(this._board.maxX, this._board.maxY);
        break;
      case "initRandom":
        this._board.initRandom();
        break;
      case "initRegular":
        this._board.initRegular();
        break;
      case "size":
        this._board.init(action.payload, action.payload);
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