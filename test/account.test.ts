import { InMemorySigner } from "@taquito/signer";
import { expect, test } from "vitest";

test("Bob account", async () => {
  const privKey = "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt";
  const signer = new InMemorySigner(privKey);
  const pubkeyHash = await signer.publicKeyHash();
  expect(pubkeyHash).toEqual("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6");
});
