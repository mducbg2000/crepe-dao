import { createResource } from "solid-js";
import { getLastestGlobalModel } from "../services/io-service";
import { DaoStorage } from "../services/storage-service";
import { storage } from "./contract";

export const [globalModel, setGlobalModel] = createResource(
  storage,
  (s?: DaoStorage) => {
    if (s === undefined) return undefined;
    return getLastestGlobalModel(s);
  },
);
