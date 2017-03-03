import {Action} from "../actions/Action";
import StoreBase from "./StoreBase";
import log from "../Logger";

export type BoardEntryType = {isAlive: boolean, neighborCount: number, lastNeighborCount?: number};
export type BoardType = BoardEntryType[];
export class ModelStore extends StoreBase {

  private x: number;
  private y: number;
  private _board: BoardType;
  private NEIGHBOR_OFFSETS: number[];
  private static DEFAULT_SIZE: number = 150;


  constructor() {
    super();
    this.init(ModelStore.DEFAULT_SIZE, ModelStore.DEFAULT_SIZE);
  }

  private init(x: number, y: number): void {
    this._board = [];
    this.x = x;
    this.y = y;
    this.NEIGHBOR_OFFSETS = [-1, -x - 1, -x, -x + 1, 1, x - 1, x, x + 1];
    for (let i = 0; i < x * y; i++) {
      this._board.push({isAlive: false, neighborCount: 0});
    }
  }

  /**
   * initializes board with randomly set life
   */
  private initRandom(): void {
    const x = this.dimensions.x;
    const y = this.dimensions.y;
    this.init(x, y);
    for (let i = 0; i < x * y; i++) {
      this._board[i].isAlive = Math.random() < 0.3;
    }
    for (let i = 0; i < x * y; i++) {
      if (this._board[i].isAlive) {
        this.adjustNeighbors(i, 1);
      }
    }
  }

  public board(x: number, y: number): BoardEntryType {
    return this._board[this.index(x, y)];
  }

  public get dimensions(): {x: number, y: number} {
    return {x: this.x, y: this.y};
  }

  /**
   * adjust all neighbor counts of the given life by adding delta
   * @param index
   * @param delta
   */
  private adjustNeighbors(index: number, delta: number): void {
    for (const d of this.NEIGHBOR_OFFSETS) {
      const neighborIndex = index + d;
      if (neighborIndex >= 0 && neighborIndex < this.x * this.y) {
        this._board[neighborIndex].neighborCount += delta;
      }
    }
  }

  /**
   * calculate next life generation in board
   */
  private calculateNextGeneration(): void {
    // first save all neighborCounts in lastNeighborCount, then
    this._board.forEach(x => x.lastNeighborCount = x.neighborCount);

    for (let i = 0; i < this.x * this.y; i++) {
      // if _board has 2 or 3 neighbors, stay alive
      // if _board has 3 neighbors, new born

      const nc = this._board[i].lastNeighborCount;
      const isAlive = this._board[i].isAlive;
      if (isAlive && (nc < 2 || nc > 3)) {
        // < 2 || > 3 neighbors --> died
        this._board[i].isAlive = false;
        this.adjustNeighbors(i, -1);
      } else if (!isAlive && nc === 3) {
        // === 3 neighbors -> born
        this._board[i].isAlive = true;
        this.adjustNeighbors(i, 1);
      }
    }
  }

  private set(x: number, y: number, value: boolean): void {
    const index = this.index(x, y);
    if (this._board[index].isAlive !== value) {
      this._board[index].isAlive = value;
      this.adjustNeighbors(index, value ? 1 : -1);
    }
  }

  private index(x: number, y: number): number {
    return x + this.x * y;
  }

  accept(action: Action): void {
    log.debug("ModelStore accepting", action);
    switch (action.type) {
      case "clear":
        this.init(this.dimensions.x, this.dimensions.y);
        break;
      case "initRandom":
        this.initRandom();
        break;
      case "size":
        this.init(action.payload, action.payload);
        break;
      case "next":
        this.calculateNextGeneration();
        break;
      case "set":
        const {x, y, value} = action.payload;
        this.set(x, y, value);
    }
    this.notify(action.type);
  }
}

export default new ModelStore();