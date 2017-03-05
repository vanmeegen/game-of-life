import {Action} from "../actions/Action";
import StoreBase from "./StoreBase";
import log from "../Logger";
import {stimo, stimo_get, stimo_set} from "stimo";
import {List} from "immutable";


@stimo
export class LifeCell {

  constructor(alive: boolean, neighborCount: number) {
    this.setAlive(alive).setNeighborCount(neighborCount);
  }

  @stimo_get get alive(): boolean {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setAlive(newValue: boolean): LifeCell {
    return null;
  };

  @stimo_get get neighborCount(): number {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setNeighborCount(newValue: number): LifeCell {
    return null;
  };
}

/**
 * models a Game of Life Board with current neighbor count
 */
@stimo
export class Board {
  @stimo_get get neighborOffsets(): number[] {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setNeighborOffsets(newValue: number[]): Board {
    return null;
  };

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

  @stimo_get get cells(): List<LifeCell> {
    return null;
  };

  //noinspection JSUnusedLocalSymbols
  @stimo_set setCells(newValue: List<LifeCell>): Board {
    return null;
  };

  constructor(maxX: number, maxY: number) {
    this.initSize(maxX, maxY).initEmpty();
  }

  set(x: number, y: number, value: boolean): Board {
    const newCells = this.cells.withMutations((cells: List<LifeCell>) => {
      const index = this.index(x, y);
      if (cells.get(index).alive !== value) {
        cells = cells.set(index, cells.get(index).setAlive(value));
        cells = this.adjustNeighbors(cells, index, value ? 1 : -1);
      }
      return cells;
    });
    log.info("New Cells after set " + x + ", " + y + ": " + JSON.stringify(newCells.get(this.index(x, y))));
    return this.setCells(newCells);
  }

  /**
   * make sure this is always called inside withMutations !
   * adjust all neighbor counts of the given life by adding delta
   * @param cells cells to adjust neigbors in
   * @param index life to adjust
   * @param delta +/- 1 neighbor to adjust
   */
  private adjustNeighbors(cells: List<LifeCell>, index: number, delta: number): List<LifeCell> {
    let result: List<LifeCell> = cells;
    for (const d of this.neighborOffsets) {
      const neighborIndex = index + d;
      if (neighborIndex >= 0 && neighborIndex < this.maxX * this.maxY) {
        const entry = result.get(neighborIndex);
        result = result.set(neighborIndex, entry.setNeighborCount(entry.neighborCount + delta));
      }
    }
    return result;
  }

  /**
   * initializes cell with randomly set life
   */
  public initRandom(): Board {
    const newCells = this.cells.withMutations((cells: List<LifeCell>) => {
      for (let i = 0; i < this.maxX * this.maxY; i++) {
        cells = cells.set(i, cells.get(i).setAlive(Math.random() < 0.3));
      }
      for (let i = 0; i < this.maxX * this.maxY; i++) {
        if (cells.get(i).alive) {
          cells = this.adjustNeighbors(cells, i, 1);
        }
      }
      return cells;
    });
    return this.setCells(newCells);
  }

  /**
   * initializes cell with regular pattern for better reproducability
   */
  public initRegular(): Board {
    const newCells = this.cells.withMutations((cells: List<LifeCell>) => {
      for (let i = 0; i < this.maxX * this.maxY; i++) {
        cells = cells.set(i, cells.get(i).setAlive(i % 3 === 0));
      }
      for (let i = 0; i < this.maxX * this.maxY; i++) {
        if (cells.get(i).alive) {
          cells = this.adjustNeighbors(cells, i, 1);
        }
      }
      return cells;
    });
    return this.setCells(newCells);
  }

  /**
   * calculate next life generation in cell
   */
  public calculateNextGeneration(): Board {
    const lastCells = this.cells;
    const newCells = this.cells.withMutations((cells: List<LifeCell>) => {
      // remember cells for last neighborcount
      for (let i = 0; i < this.maxX * this.maxY; i++) {
        const nc = lastCells.get(i).neighborCount;
        const isAlive = lastCells.get(i).alive;
        if (isAlive && (nc < 2 || nc > 3)) {
          // < 2 || > 3 neighbors --> died
          const entry = cells.get(i);
          cells = cells.set(i, entry.setAlive(false));
          cells = this.adjustNeighbors(cells, i, -1);
        } else if (!isAlive && nc === 3) {
          const entry = cells.get(i);
          // === 3 neighbors -> born
          cells = cells.set(i, entry.setAlive(true));
          cells = this.adjustNeighbors(cells, i, 1);
        }
      }
      return cells;
    });
    return this.setCells(newCells);
  }

  public cell(x: number, y: number): LifeCell {
    return this.cells.get(this.index(x, y));
  }

  public initSize(x: number, y: number): Board {
    return this.setMaxX(x).setMaxY(y).setNeighborOffsets([-1, -x - 1, -x, -x + 1, 1, x - 1, x, x + 1]).setCells(List<LifeCell>().setSize(x * y));
  }

  initEmpty(): Board {
    let cells = this.cells.withMutations((cells: List<LifeCell>) => {
      for (let i = 0; i < this.maxX * this.maxY; i++) {
        cells = cells.set(i, new LifeCell(false, 0));
      }
    });
    return this.setCells(cells);
  }


  private index(x: number, y: number): number {
    return x + this.maxX * y;
  }
}

export class ModelStore extends StoreBase {

  private _board: Board;
  private static DEFAULT_SIZE: number = 150;

  constructor() {
    super();
    this._board = new Board(ModelStore.DEFAULT_SIZE, ModelStore.DEFAULT_SIZE).initEmpty();
  }

  public cell(x: number, y: number): LifeCell {
    return this._board.cell(x, y);
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