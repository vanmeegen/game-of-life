import "mocha";
import {ModelStore} from "../../src/stores/ModelStore";
import {expect} from "chai";

describe("the model store", () => {

  let modelStore;
  beforeEach(() => {
    modelStore = new ModelStore();
  });

  describe("it manages the board correctly", () => {
        it("sets one life if set is called with true", () => {
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
          expect(modelStore.board[0].isAlive).to.equal(true);
        });
        it("resets one life if set is called with false", () => {
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: false}});
          expect(modelStore.board[0].isAlive).to.equal(false);
        });
      }
  );

  describe("it calculates game of life rules correctly", () => {
        it("deletes a field with less than 2 or more than 3 neighbors", () => {
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
          modelStore.accept({type: "next"});
          expect(modelStore.board[0].isAlive).to.equal(false);
        })
        ;
      }
  );

});

