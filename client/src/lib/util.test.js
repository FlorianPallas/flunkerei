import { expect, test } from "vitest";
import { generateQuestionMappings } from "./util";
import { describe } from "vitest";

describe("generateQuestionMappings", () => {
  test("throws for 0 players", () => {
    expect(() => generateQuestionMappings({})).toThrowError(
      "At least two players are required"
    );
  });

  test("throws for 1 players", () => {
    expect(() =>
      generateQuestionMappings({
        p1: "q1",
      })
    ).toThrowError("At least two players are required");
  });

  test("works with 2 players", () => {
    expect(
      generateQuestionMappings({
        a: "q1",
        b: "q2",
      })
    ).toEqual({
      a: "b",
      b: "a",
    });
  });

  test.each([3, 4, 5, 6, 7, 8, 9, 10])("works with %i players", (count) => {
    /** @type {Record<string,string>} */
    let questions = {};
    for (let i = 0; i < count; i++) {
      questions[`p${i}`] = `q${i}`;
    }

    const mappings = generateQuestionMappings(questions);

    for (let i = 0; i < count; i++) {
      expect(mappings[`p${i}`]).not.toBe(`p${i}`);
    }
  });
});
