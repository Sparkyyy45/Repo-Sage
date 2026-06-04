import { describe, it, expect } from "vitest";
import { estimateDifficulty } from "@/lib/difficulty";

describe("estimateDifficulty", () => {
  it("returns Beginner for good first issue label with few comments", () => {
    const result = estimateDifficulty({
      labels: ["good first issue"],
      comments: 0,
      title: "Fix typo in README",
    });
    expect(result).toBe("Beginner");
  });

  it("returns Advanced for complex label with many comments", () => {
    const result = estimateDifficulty({
      labels: ["hard", "refactor"],
      comments: 15,
      title: "Redesign API authentication flow",
    });
    expect(result).toBe("Advanced");
  });

  it("returns Beginner for enhancement label (classified as beginner-friendly)", () => {
    const result = estimateDifficulty({
      labels: ["enhancement"],
      comments: 5,
      title: "Add new button component",
    });
    expect(result).toBe("Beginner");
  });

  it("returns Beginner for no labels and no comments (low-comment default)", () => {
    const result = estimateDifficulty({
      labels: [],
      comments: 0,
      title: "Some issue",
    });
    expect(result).toBe("Beginner");
  });

  it("returns Beginner for documentation label", () => {
    const result = estimateDifficulty({
      labels: ["documentation"],
      comments: 1,
      title: "Update installation guide",
    });
    expect(result).toBe("Beginner");
  });

  it("returns Beginner for empty labels and no comments", () => {
    const result = estimateDifficulty({
      labels: [],
      comments: 0,
      title: "",
    });
    expect(result).toBe("Beginner");
  });

  it("returns Intermediate for refactor title keyword with moderate comments", () => {
    const result = estimateDifficulty({
      labels: [],
      comments: 6,
      title: "Refactor database connection pooling",
    });
    expect(result).toBe("Intermediate");
  });
});
