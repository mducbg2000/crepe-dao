import { test } from "vitest";
import appConfig from "../src/config";
import { tezosClient } from "../src/services/contract-service";

test("Get contract", async () => {
  const contract = await tezosClient.contract.at(
    appConfig.VITE_CONTRACT_ADDRESS
  );

  console.log(contract.methods["add_local_model"]);
});
