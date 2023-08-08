import { MichelsonMap } from "@taquito/taquito";
import BigNumber from "bignumber.js";

interface ModelInfoRaw {
  topo_cid: string;
  weights_cid: string;
  nbsamples: BigNumber;
  owner: string;
  round: BigNumber;
  accepted: boolean;
  accept_point: BigNumber;
  reject_point: BigNumber;
  abstain_point: BigNumber;
  voters: string[];
}

interface MemberInfoRaw {
  point: BigNumber;
  withdrew: BigNumber;
}

export interface DaoStateRaw {
  init_topo_cid: string;
  init_weights_cid: string;
  quorum: Record<"2" | "3", BigNumber>;
  super_majority: Record<"4" | "5", BigNumber>;
  fraction_of_members: Record<"6" | "7", BigNumber>;
  min_models: BigNumber;
  reward_point: BigNumber;
  current_round: BigNumber;
  members: MichelsonMap<string, MemberInfoRaw>;
  models: MichelsonMap<string, ModelInfoRaw>;
}

const toModelInfo = (m: ModelInfoRaw) => ({
  topoCID: m.topo_cid,
  weightsCID: m.weights_cid,
  nbsamples: m.nbsamples.toNumber(),
  owner: m.owner,
  round: m.round.toNumber(),
  accepted: m.accepted,
  acceptPoint: m.accept_point.toNumber(),
  rejectPoint: m.reject_point.toNumber(),
  abstainPoint: m.abstain_point.toNumber(),
  voters: m.voters,
});

const toMemberInfo = (m: MemberInfoRaw) => ({
  point: m.point.toNumber(),
  withdrew: m.withdrew.toNumber(),
});

const modelsToArray = (p: DaoStateRaw["models"]) =>
  [...p.entries()].map((e) => ({
    id: e[0],
    ...toModelInfo(e[1]),
  }));

const membersToArray = (p: DaoStateRaw["members"]) =>
  [...p.entries()].map((e) => ({
    address: e[0],
    ...toMemberInfo(e[1]),
  }));

export const toDaoState = (r: DaoStateRaw) => ({
  initTopoCid: r.init_topo_cid,
  initWeightsCid: r.init_weights_cid,
  quorum: r.quorum[2].div(r.quorum[3]).decimalPlaces(4).toNumber(),
  superMajority: r.super_majority[4]
    .div(r.super_majority[5])
    .decimalPlaces(4)
    .toNumber(),
  fractionOfMembers: r.fraction_of_members[6]
    .div(r.fraction_of_members[7])
    .decimalPlaces(4)
    .toNumber(),
  minModels: r.min_models.toNumber(),
  currentRound: r.current_round.toNumber(),
  members: membersToArray(r.members),
  models: modelsToArray(r.models),
});

export type DaoState = ReturnType<typeof toDaoState>;
export type ModelInfo = ReturnType<typeof toModelInfo> & { id: string };
