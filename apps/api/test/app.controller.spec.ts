import { describe, expect, it } from "vitest";

import { AppController } from "../src/app.controller";

describe("AppController", () => {
  it("returns the Hello World smoke payload", () => {
    expect(new AppController().getHello()).toEqual({ message: "Hello World" });
  });
});
