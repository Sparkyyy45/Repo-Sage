import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRateLimitInfo, formatResetTime } from "@/lib/rate-limit";
type MockOctokit = {
  rest: {
    rateLimit: {
      get: () => Promise<{
        data: {
          resources: {
            core: {
              remaining: number;
              limit: number;
              reset: number;
            };
          };
        };
      }>;
    };
  };
};

describe("getRateLimitInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correct data when under rate limit", async () => {
    const mockOctokit = {
      rest: {
        rateLimit: {
          get: vi.fn().mockResolvedValue({
            data: {
              resources: {
                core: {
                  remaining: 50,
                  limit: 60,
                  reset: 1234567890,
                },
              },
            },
          }),
        },
      },
    };

    const result = await getRateLimitInfo(mockOctokit as MockOctokit);

    expect(result).toEqual({
      remaining: 50,
      total: 60,
      reset: 1234567890,
      isLimited: false,
    });
  });

  it("marks as rate limited when remaining is below threshold", async () => {
    const mockOctokit = {
      rest: {
        rateLimit: {
          get: vi.fn().mockResolvedValue({
            data: {
              resources: {
                core: {
                  remaining: 5,
                  limit: 60,
                  reset: 1234567890,
                },
              },
            },
          }),
        },
      },
    };

    const result = await getRateLimitInfo(mockOctokit as MockOctokit);

    expect(result).toEqual({
      remaining: 5,
      total: 60,
      reset: 1234567890,
      isLimited: true,
    });
  });

  it("returns null when GitHub API throws an error", async () => {
    const mockOctokit = {
      rest: {
        rateLimit: {
          get: vi.fn().mockRejectedValue(new Error("API error")),
        },
      },
    };

    const result = await getRateLimitInfo(mockOctokit as MockOctokit);

    expect(result).toBeNull();
  });
});

describe("formatResetTime", () => {
  it("returns 'any moment now' when time already passed", () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    expect(formatResetTime(past)).toBe("any moment now");
  });

  it("returns '1 minute' when exactly 1 minute left", () => {
    const future = Math.floor(Date.now() / 1000) + 60;
    expect(formatResetTime(future)).toBe("1 minute");
  });

  it("returns plural minutes when multiple minutes left", () => {
    const future = Math.floor(Date.now() / 1000) + 5 * 60;
    const result = formatResetTime(future);
    expect(result).toBe("5 minutes");
  });
});