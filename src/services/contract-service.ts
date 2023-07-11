import { TezosToolkit } from "@taquito/taquito";
import appConfig from "../config";

export const tezosClient = new TezosToolkit(appConfig.VITE_TEZOS_ENDPOINT);

export async function addLocalModel(modelCid: string, numberOfSamples: number) {
  const contract = await tezosClient.contract.at(
    appConfig.VITE_CONTRACT_ADDRESS,
  );
  const op = await contract.methods["add_local_model"]!(
    modelCid,
    numberOfSamples,
  ).send();
  return op.confirmation();
}

export async function vote(modelCid: string, opinion: VoteValue) {
  const valueOf = (o: VoteValue) => {
    if (o === "reject") return 0;
    if (o === "accept") return 1;
    return 2;
  };
  const contract = await tezosClient.contract.at(
    appConfig.VITE_CONTRACT_ADDRESS,
  );
  const op = await contract.methods["vote"]!(modelCid, valueOf(opinion)).send();
  return op.confirmation();
}

export type VoteValue = "accept" | "reject" | "abstain";
