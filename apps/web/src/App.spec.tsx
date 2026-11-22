import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  it("renders Hello World as the only visible content", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html.replace(/<[^>]+>/g, "").trim()).toBe("Hello World");
  });
});
