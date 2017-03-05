import "mocha";
import {ModelStore} from "../../src/stores/ModelStore";
import {expect} from "chai";

describe("the model store", () => {

  let modelStore: ModelStore;
  beforeEach(() => {
    modelStore = new ModelStore();
  });

  describe("it manages the cell correctly", () => {
        it("sets one life if set is called with true", () => {
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
          expect(modelStore.cell(0, 0).alive).to.equal(true);
        });
        it("resets one life if set is called with false", () => {
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: false}});
          expect(modelStore.cell(0, 0).alive).to.equal(false);
        });
    it("updates all neighbor counts if one life is set", () => {
      modelStore.accept({type: "set", payload: {x: 1, y: 1, value: true}});
      expect(modelStore.cell(0, 0).neighborCount).to.equal(1);
      expect(modelStore.cell(1, 0).neighborCount).to.equal(1);
      expect(modelStore.cell(2, 0).neighborCount).to.equal(1);
      expect(modelStore.cell(0, 1).neighborCount).to.equal(1);
      expect(modelStore.cell(1, 1).neighborCount).to.equal(0);
      expect(modelStore.cell(2, 1).neighborCount).to.equal(1);
      expect(modelStore.cell(0, 2).neighborCount).to.equal(1);
      expect(modelStore.cell(1, 2).neighborCount).to.equal(1);
      expect(modelStore.cell(2, 2).neighborCount).to.equal(1);
    });
    it("updates all neighbor counts if one life is reset", () => {
      modelStore.accept({type: "set", payload: {x: 1, y: 1, value: true}});
      modelStore.accept({type: "set", payload: {x: 1, y: 1, value: false}});
      expect(modelStore.cell(0, 0).neighborCount).to.equal(0);
      expect(modelStore.cell(1, 0).neighborCount).to.equal(0);
      expect(modelStore.cell(2, 0).neighborCount).to.equal(0);
      expect(modelStore.cell(0, 1).neighborCount).to.equal(0);
      expect(modelStore.cell(1, 1).neighborCount).to.equal(0);
      expect(modelStore.cell(2, 1).neighborCount).to.equal(0);
      expect(modelStore.cell(0, 2).neighborCount).to.equal(0);
      expect(modelStore.cell(1, 2).neighborCount).to.equal(0);
      expect(modelStore.cell(2, 2).neighborCount).to.equal(0);
        });
      }
  );

  describe("it calculates game of life rules correctly", () => {
    it("deletes a field with 1 neighbor", () => {
          modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
      modelStore.accept({type: "set", payload: {x: 1, y: 0, value: true}});
          modelStore.accept({type: "next"});
      expect(modelStore.cell(0, 0).alive).to.equal(false);
      expect(modelStore.cell(1, 0).alive).to.equal(false);
    });
    it("deletes a field with more than 3 neighbors", () => {
      // field has 4 neighbors
      modelStore.accept({type: "set", payload: {x: 1, y: 0, value: true}});
      modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
      modelStore.accept({type: "set", payload: {x: 2, y: 0, value: true}});
      modelStore.accept({type: "set", payload: {x: 0, y: 1, value: true}});
      modelStore.accept({type: "set", payload: {x: 1, y: 1, value: true}});
      modelStore.accept({type: "next"});
      expect(modelStore.cell(1, 0).alive).to.equal(false);
    });
    it("creates new life on a field with 3 neighbors", () => {
      // field has 4 neighbors
      modelStore.accept({type: "set", payload: {x: 0, y: 0, value: true}});
      modelStore.accept({type: "set", payload: {x: 2, y: 0, value: true}});
      modelStore.accept({type: "set", payload: {x: 1, y: 1, value: true}});
      modelStore.accept({type: "next"});
      expect(modelStore.cell(1, 0).alive).to.equal(true);
    });
    it("calculates oscillator --- correctly", () => {
      // field has 4 neighbors
      modelStore.accept({type: "set", payload: {x: 1, y: 1, value: true}});
      modelStore.accept({type: "set", payload: {x: 2, y: 1, value: true}});
      modelStore.accept({type: "set", payload: {x: 3, y: 1, value: true}});
      modelStore.accept({type: "next"});
      expect(modelStore.cell(1, 1).alive).to.equal(false);
      expect(modelStore.cell(2, 1).alive).to.equal(true);
      expect(modelStore.cell(3, 1).alive).to.equal(false);
      expect(modelStore.cell(2, 0).alive).to.equal(true);
      expect(modelStore.cell(2, 2).alive).to.equal(true);
    });
      }
  );

});

