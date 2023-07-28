import { MichelsonMap } from "@taquito/taquito";
import BigNumber from "bignumber.js";

interface PoolValueRaw {
  nbsamples: BigNumber;
  owner: string;
  round: BigNumber;
  accepted: boolean;
}

interface PollValueRaw {
  accept_point: BigNumber;
  reject_point: BigNumber;
  abstain_point: BigNumber;
  voter: string[];
}

const toPoolValue = (p: PoolValueRaw) => ({
  nbsamples: p.nbsamples.toNumber(),
  owner: p.owner,
  round: p.round.toNumber(),
  accepted: p.accepted,
});

const toPollValue = (p: PollValueRaw) => ({
  accept_point: p.accept_point.toNumber(),
  reject_point: p.reject_point.toNumber(),
  abstain_point: p.abstain_point.toNumber(),
  voter: p.voter,
});

type PoolValue = ReturnType<typeof toPoolValue>;
type PollValue = ReturnType<typeof toPollValue>;

const memberToMap = (m: MichelsonMap<string, BigNumber>) =>
  new Map(
    [...m.entries()].map((e) => [e[0], e[1].toNumber()] as [string, number]),
  );

const poolToMap = (p: MichelsonMap<string, PoolValueRaw>) =>
  new Map(
    [...p.entries()].map(
      (e) => [e[0], toPoolValue(e[1])] as [string, PoolValue],
    ),
  );

const pollToMap = (p: MichelsonMap<string, PollValueRaw>) =>
  new Map(
    [...p.entries()].map(
      (e) => [e[0], toPollValue(e[1])] as [string, PollValue],
    ),
  );

export interface DaoStateRaw {
  model_topo_cid: string;
  init_weights_cid: string;
  quorum: Record<"2" | "3", BigNumber>;
  super_majority: Record<"4" | "5", BigNumber>;
  fraction_of_members: Record<"6" | "7", BigNumber>;
  min_models: BigNumber;
  reward_point: BigNumber;
  current_round: BigNumber;
  member: MichelsonMap<string, BigNumber>;
  pool: MichelsonMap<string, PoolValueRaw>;
  poll: MichelsonMap<string, PollValueRaw>;
}

export const toDaoState = (r: DaoStateRaw) => ({
  modelTopoCid: r.model_topo_cid,
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
  rewardPoint: r.reward_point.toNumber(),
  currentRound: r.current_round.toNumber(),
  member: memberToMap(r.member),
  pool: poolToMap(r.pool),
  poll: pollToMap(r.poll),
});

export type DaoState = ReturnType<typeof toDaoState>;
