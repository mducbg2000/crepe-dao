import { expect, test } from "vitest";
import appConfig from "../src/config";

test("ENV", () => {
  expect(appConfig.VITE_CONTRACT_ADDRESS).toEqual(
    "KT1AQkTzhuu9CqvZ57ombB8Q3VKUCbhYU3Gc"
  );
});
