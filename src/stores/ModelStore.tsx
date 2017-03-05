import {Action} from "../actions/Action";
import StoreBase from "./StoreBase";
import log from "../Logger";
import {stimo, stimo_get, stimo_set} from "stimo";
import {List} from "immutable";
import {Point} from "../util/Geometry";


function getLifeCell(cells: List<List<boolean>>, x: number, y: number): boolean {
  return cells.get(y).get(x);
}

function setLifeCell(cells: List<List<boolean>>, x: number, y: number, newContent: boolean): List<List<boolean>> {
  return cells.set(y, cells.get(y).set(x, newContent));
}

const NEIGHBOR_OFFSETS: Point[] = [new Point(-1, -1), new Point(-1, 0), new Point(-1, 1), new Point(0, -1), new Point(0, 1), new Point(1, -1), new Point(1, 0), new Point(1, 1)];
// not immutable
let neighbors: number[];

/**
 * models a Game of Life Board with current neighbor count
 */
@stimo
export class Board {

  @stimo_get get maxX(): number {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setMaxX(newValue: number): Board {
    return null;
  };

  @stimo_get get maxY(): number {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setMaxY(newValue: number): Board {
    return null;
  };

  @stimo_get get cells(): List<List<boolean>> {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setCells(newValue: List<List<boolean>>): Board {
    return null;
  };

  constructor(maxX: number, maxY: number) {
    this.initSize(maxX, maxY).initEmpty();
  }

  set(x: number, y: number, value: boolean): Board {
    const newCells = this.cells.withMutations((cells: List<List<boolean>>) => {
      const alive = getLifeCell(cells, x, y);
      if (alive !== value) {
        cells = setLifeCell(cells, x, y, value);
        this.adjustNeighbors(x, y, value ? 1 : -1);
      }
      return cells;
    });
    return this.setCells(newCells);
  }

  /**
   * adjust all neighbor counts of the given life by adding delta
   * @param x xpos of life to adjust
   * @param y ypos of life to adjust
   * @param delta +/- 1 neighbor to adjust
   */
  private adjustNeighbors(x: number, y: number, delta: number): void {
    for (const d of NEIGHBOR_OFFSETS) {
      const nx = x + d.x;
      const ny = y + d.y;
      if (nx >= 0 && nx < this.maxX && ny >= 0 && ny < this.maxY) {
        neighbors[this.index(nx, ny)] += delta;
      }
    }
  }

  /**
   * initializes cell with randomly set life
   */
  public initRandom(): Board {
    return this.init(cell => Math.random() < 0.3);
  }

  /**
   * initializes cell with regular pattern for better reproducability
   */
  public initRegular(): Board {
    return this.init((cell, x, y) => (x + this.maxX * y) % 3 === 0);
  }

  initEmpty(): Board {
    return this.init(cell => false);
  }

  private init(callback: (cell: boolean, x?: number, y?: number) => boolean): Board {
    let cells = this.cells.withMutations((cells: List<List<boolean>>) => {
      for (let y = 0; y < this.maxX; y++) {
        for (let x = 0; x < this.maxX; x++) {
          const cell = getLifeCell(cells, x, y);
          cells = setLifeCell(cells, x, y, callback(cell, x, y));
        }
      }
      for (let y = 0; y < this.maxX; y++) {
        for (let x = 0; x < this.maxX; x++) {
          const alive = getLifeCell(cells, x, y);
          if (alive) {
            this.adjustNeighbors(x, y, 1);
          }
        }
      }
    });
    return this.setCells(cells);
  }


  /**
   * calculate next life generation in cell
   */
  public calculateNextGeneration(): Board {
    const lastNeighbors: number[] = neighbors.slice(0);
    const newCells = this.cells.withMutations((cells: List<List<boolean>>) => {
      // remember cells for last neighborcount
      for (let y = 0; y < this.maxX; y++) {
        for (let x = 0; x < this.maxX; x++) {
          const nc = lastNeighbors[this.index(x, y)];
          const isAlive = getLifeCell(cells, x, y);
          if (isAlive && (nc < 2 || nc > 3)) {
            // < 2 || > 3 neighbors --> died
            cells = setLifeCell(cells, x, y, false);
            this.adjustNeighbors(x, y, -1);
          } else if (!isAlive && nc === 3) {
            // === 3 neighbors -> born
            cells = setLifeCell(cells, x, y, true);
            this.adjustNeighbors(x, y, 1);
          }
        }
      }
      return cells;
    });
    return this.setCells(newCells);
  }

  public cell(x: number, y: number): boolean {
    return getLifeCell(this.cells, x, y);
  }

  public neighborCount(x: number, y: number): number {
    return neighbors[this.index(x, y)];
  }


  private index(x: number, y: number): number {
    return x + this.maxX * y;
  }

  public initSize(x: number, y: number): Board {
    neighbors = new Array(x * y).fill(0);
    let list = List<List<boolean>>().setSize(y);
    list.forEach((row, index) => {
      list = list.set(index, List<boolean>().setSize(x));
    });
    return this.setMaxX(x).setMaxY(y).setCells(list);
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
    log.info("ModelStore accepting", action);
    switch (action.type) {
      case "clear":
        this._board = this._board.initEmpty();
        break;
      case "initRandom":
        this._board = this._board.initRandom();
        break;
      case "initRegular":
        this._board = this._board.initRegular();
        break;
      case "size":
        this._board = this._board.initSize(action.payload, action.payload).initEmpty();
        break;
      case "next":
        this._board = this._board.calculateNextGeneration();
        break;
      case "set":
        const {x, y, value} = action.payload;
        this._board = this._board.set(x, y, value);
    }
    this.notify(action.type);
  }
}

export default new ModelStore();