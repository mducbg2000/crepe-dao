import { TezosToolkit } from "@taquito/taquito";
import appConfig from "../config";

export const tezosClient = new TezosToolkit(appConfig.VITE_TEZOS_ENDPOINT);
export const contractLoader = tezosClient.contract.at(
  appConfig.VITE_CONTRACT_ADDRESS,
);
export type VoteValue = "accept" | "reject" | "abstain";

export const contributeLocalModel = async (
  topoCid: string,
  weightsCid: string,
  numberOfSamples: number,
) => {
  const contract = await contractLoader;
  const op = await contract.methods["contribute"]!(
    topoCid,
    weightsCid,
    numberOfSamples,
  ).send();
  await op.confirmation(3);
  return op.hash;
};

export const vote = async (modelId: string, opinion: VoteValue) => {
  const valueOf = (o: VoteValue) => {
    if (o === "reject") return 0;
    if (o === "accept") return 1;
    return 2;
  };
  const contract = await contractLoader;
  const op = await contract.methods["vote"]!(modelId, valueOf(opinion)).send();
  await op.confirmation(3);
  return op.hash;
};

export const fundraise = async (amount: number) => {
  const contract = await contractLoader;
  const op = await contract.methods["default"]!().send({
    amount,
    mutez: false,
  });
  await op.confirmation(3);
  return op.hash;
};

export const withdraw = async (amount: number) => {
  const contract = await contractLoader;
  const op = await contract.methods["withdraw"]!(amount).send();
  await op.confirmation(3);
  return op.hash;
};
