import "mocha";
import {ModelStore} from "../../src/stores/ModelStore";
import {expect} from "chai";

describe("the model store", () => {

  let modelStore;
  beforeEach(() => {
    modelStore = new ModelStore();
  });
  describe("it calculates game of life rules correctly", () => {
        it("deletes a field with less than 2 or more than 3 neighbors", () => {
          modelStore.field[0] = {isAlive: true, neighborCount: 1};
          modelStore.accept({type: "next"});
          expect(modelStore.field[0].isAlive).to.equal(false);
        });
      }
  );

});

