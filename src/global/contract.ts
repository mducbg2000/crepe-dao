import {
  type ContractAbstraction,
  type ContractProvider,
} from "@taquito/taquito";
import { createResource } from "solid-js";
import appConfig from "../config";
import { tezosClient } from "../services/contract-service";
import { type DaoStorage } from "../services/storage-service";

export const [contract] = createResource(async () =>
  tezosClient.contract.at(appConfig.VITE_CONTRACT_ADDRESS),
);
export const [storage, setStorage] = createResource(
  contract,
  async (c: ContractAbstraction<ContractProvider>) =>
    (await c.storage()) satisfies DaoStorage,
);
