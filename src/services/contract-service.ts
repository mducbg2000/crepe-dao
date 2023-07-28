import { TezosToolkit } from "@taquito/taquito";
import appConfig from "../config";
import { DaoState, DaoStateRaw, toDaoState } from "./serialized-service";

export const tezosClient = new TezosToolkit(appConfig.VITE_TEZOS_ENDPOINT);
const contractLoader = tezosClient.contract.at(appConfig.VITE_CONTRACT_ADDRESS);

export const addLocalModel = async (
  modelCid: string,
  numberOfSamples: number,
) => {
  const contract = await contractLoader;
  const op = await contract.methods["add_local_model"]!(
    modelCid,
    numberOfSamples,
  ).send();
  return op.confirmation();
};

export type VoteValue = "accept" | "reject" | "abstain";
export const vote = async (modelCid: string, opinion: VoteValue) => {
  const valueOf = (o: VoteValue) => {
    if (o === "reject") return 0;
    if (o === "accept") return 1;
    return 2;
  };
  const contract = await contractLoader;
  const op = await contract.methods["vote"]!(modelCid, valueOf(opinion)).send();
  return op.confirmation();
};

export const loadStorage = async (): Promise<DaoState> => {
  const contract = await contractLoader;
  const storage: DaoStateRaw = await contract.storage();
  return toDaoState(storage);
};
