// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from "vitest";
import { retrieveFile } from "../src/services/ipfs-service";

test("Load models", async () => {
  const model = await retrieveFile(
    "QmSAHEgh5NozH8ALJk11WP4SdKSC1pQwnrFJ7wadUkz1gS",
    "json",
  );
  console.log(model);
});
