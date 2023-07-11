import * as fs from "fs";
import { expect, test } from "vitest";
import { retrieveFile } from "../src/services/ipfs-service";

test("get weights file", async () => {
  const weightsBinary = await retrieveFile(
    "QmayScJpjfU2FBosY2EJYz81D5Cw5H7dd4RnfrNFhF7qXZ",
  );
  const actualWeights = fs.readFileSync("models/lstm-js/group1-shard1of1.bin");
  expect(weightsBinary).toEqual(actualWeights.toString());
});
