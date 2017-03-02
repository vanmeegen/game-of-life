import {Action} from "../actions/Action";
import StoreBase from "./StoreBase";
import log from "../Logger";

export type BoardType = {isAlive: boolean, neighborCount: number}[];
export class ModelStore extends StoreBase {

  private x: number;
  private y: number;
  private _board: BoardType;
  private NEIGHBOR_OFFSETS: number[];


  constructor() {
    super();
    this.init(10, 10);
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
   * create a new board with randomly set life
   * @param x x-size
   * @param y y-size
   */
  private initRandom(x: number, y: number): void {
    this.init(x, y);
    for (let i = 0; i < x * y; i++) {
      this._board.push({isAlive: Math.random() < 0.2, neighborCount: 0});
    }
    for (let i = 0; i < x * y; i++) {
      if (this._board[i].isAlive) {
        this.adjustNeighbors(i, 1);
      }
    }
  }

  public get board(): BoardType {
    return this._board;
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
        this._board[neighborIndex].neighborCount += d;
      }
    }
  }

  /**
   * calculate next life generation in board
   */
  private calculateNextGeneration(): void {
    for (let i = 0; i < this.x * this.y; i++) {
      // if _board has 2 or 3 neighbors, stay alive
      // if _board has 3 neighbors, new born

      const nc = this._board[i].neighborCount;
      const isAlive = this._board[i].isAlive;
      if (isAlive && (nc < 2 || nc > 3)) {
        this._board[i].isAlive = false;
        this.adjustNeighbors(i, -1);
      } else {

      }
    }
  }

  private set(x: number, y: number, value: boolean) {
    const index = this.index(x, y);
    if (this.board[index].isAlive !== value) {
      this.board[index].isAlive = value;
      this.adjustNeighbors(index, value ? 1 : -1);
    }
  }

  private index(x: number, y: number): number {
    return x + this.x * y;
  }

  accept(action: Action): void {
    log.debug("ModelStore accepting", action);
    switch (action.type) {
      case "reinit":
        this.init(10, 10);
        break;
      case "initRandom":
        this.initRandom(10, 10);
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