"use strict";

import engineFactory from "../src/index";
import Almanac from "../src/almanac";
import sinon from "sinon";

describe("Branching conditions: run", () => {
  let engine, rule, rule2;
  let sandbox;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  const condition21 = {
    any: [
      {
        fact: "age",
        operator: "greaterThanInclusive",
        value: 21,
      },
    ],
  };
  const condition75 = {
    any: [
      {
        fact: "age",
        operator: "greaterThanInclusive",
        value: 75,
      },
    ],
  };
  let eventSpy;
  let failureSpy;

  beforeEach(() => {
    eventSpy = sandbox.spy();
    failureSpy = sandbox.spy();
    engine = engineFactory();
    rule = factories.rule({
      name: "condition21",
      conditions: condition21,
      branch: {
        all: [
          {
            fact: "branch",
            operator: "equal",
            value: "flow_21",
          },
        ],
      },
      event: { type: "generic1" },
    });
    engine.addRule(rule);
    rule2 = factories.rule({
      name: "condition75",
      conditions: condition75,
      event: { type: "generic2" },
      branch: {
        all: [
          {
            fact: "branch",
            operator: "equal",
            value: "flow_75",
          },
        ],
      },
    });
    engine.addRule(rule2);
    engine.on("success", eventSpy);
    engine.on("failure", failureSpy);
  });

  describe("branch conditions: ", () => {
    it("for each rule, conditions are evaluated and events are triggered only when Branch constraint is satisfied", async () => {
      await Promise.all(
        [
          {
            age: 50,
            branch: "flow_21",
          },
          {
            age: 10,
            branch: "flow_21",
          },
          {
            age: 12,
            branch: "flow_21",
          },
          {
            age: 20,
            branch: "flow_21",
          },
          {
            age: 30,
            branch: "flow_21",
          },
          {
            age: 14,
            branch: "flow_30",
          },
          {
            age: 15,
            branch: "flow_75",
          },
          {
            age: 80,
            branch: "flow_75",
          },
        ].map((fact) => engine.run(fact))
      );
      expect(eventSpy).to.have.callCount(3);
      expect(failureSpy).to.have.callCount(4);
    });
  });
});

describe("default conditions without branches: run", () => {
  let engine, rule, rule2;
  let sandbox;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  const condition21 = {
    any: [
      {
        fact: "age",
        operator: "greaterThanInclusive",
        value: 21,
      },
    ],
  };
  const condition75 = {
    any: [
      {
        fact: "age",
        operator: "greaterThanInclusive",
        value: 75,
      },
    ],
  };
  let eventSpy;
  let failureSpy;

  beforeEach(() => {
    eventSpy = sandbox.spy();
    failureSpy = sandbox.spy();
    engine = engineFactory();
    rule = factories.rule({
      name: "condition21",
      conditions: condition21,
      event: { type: "generic1" },
    });
    engine.addRule(rule);
    rule2 = factories.rule({
      name: "condition75",
      conditions: condition75,
      event: { type: "generic2" },
    });
    engine.addRule(rule2);
    engine.on("success", eventSpy);
    engine.on("failure", failureSpy);
  });

  describe("If No branch restriction: ", () => {
    it("for each rule, should evaluate conditions ", async () => {
      await Promise.all(
        [
          {
            age: 50,
            branch: "flow_21",
          },
          {
            age: 10,
            branch: "flow_21",
          },
          {
            age: 12,
            branch: "flow_21",
          },
          {
            age: 20,
            branch: "flow_21",
          },
          {
            age: 30,
            branch: "flow_21",
          },
          {
            age: 14,
            branch: "flow_30",
          },
          {
            age: 15,
            branch: "flow_75",
          },
          {
            age: 80,
            branch: "flow_75",
          },
        ].map((fact) => engine.run(fact))
      );
      expect(eventSpy).to.have.callCount(4);
      expect(failureSpy).to.have.callCount(12);
    });
  });
});
