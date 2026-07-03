import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("returns empty string for empty input", () => {
    const result = renderMarkdown("");
    expect(result).toBe("");
  });

  it("renders ## and ### as h2 and h3", () => {
    const result = renderMarkdown("## Hello\n### World");
    expect(result).toContain("<h2>Hello</h2>");
    expect(result).toContain("<h3>World</h3>");
  });

  it("renders fenced code block as <pre><code>", () => {
    const result = renderMarkdown("```js\nconsole.log('hi')\n```");
    expect(result).toContain("<pre><code>");
    expect(result).toContain("console.log('hi')");
  });

  it("renders inline code as <code>", () => {
    const result = renderMarkdown("Use `npm install` to install");
    expect(result).toContain("<code>npm install</code>");
  });

  it("renders bold and italic", () => {
    const result = renderMarkdown("**bold** and *italic*");
    expect(result).toContain("<strong>bold</strong>");
    expect(result).toContain("<em>italic</em>");
  });

  it("renders unordered list items wrapped in <ul>", () => {
    const result = renderMarkdown("- foo\n- bar");
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>foo</li>");
    expect(result).toContain("<li>bar</li>");
  });

  it("renders ordered list items wrapped in <ol>", () => {
    const result = renderMarkdown("1. first\n2. second");
    expect(result).toContain("<ol>");
    expect(result).toContain("<li>first</li>");
    expect(result).toContain("<li>second</li>");
  });

  it("renders links with target=_blank and rel=noopener", () => {
    const result = renderMarkdown("[GitHub](https://github.com)");
    expect(result).toContain('href="https://github.com"');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain(">GitHub</a>");
  });

  it("prefixes relative URLs with https://github.com", () => {
    const result = renderMarkdown("[issue](/issues/1)");
    expect(result).toContain('href="https://github.com/issues/1"');
  });

  it("escapes XSS-prone input outside code blocks", () => {
    const result = renderMarkdown("<script>alert('xss')</script>");
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });
});
