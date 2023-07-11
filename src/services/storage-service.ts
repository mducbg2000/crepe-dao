import { type MichelsonMap } from "@taquito/taquito";
import type BigNumber from "bignumber.js";

export function getTotalPoint(s: DaoStorage) {
  return [...s.member.values()].reduce((a, b) => a.plus(b)).toNumber();
}
function getModelInfo(cid: string, storage: DaoStorage) {
  const acceptPoint = storage.poll.get(cid)!.accept_point.toNumber();
  const rejectPoint = storage.poll.get(cid)!.reject_point.toNumber();
  const abstainPoint = storage.poll.get(cid)!.abstain_point.toNumber();

  return {
    ipfsCid: cid,
    owner: storage.pool.get(cid)!.owner,
    round: storage.pool.get(cid)!.round.toNumber(),
    isAccepted: storage.pool.get(cid)!.accepted,
    numberOfSamples: storage.pool.get(cid)!.nbsamples.toNumber(),
    acceptPoint,
    rejectPoint,
    abstainPoint,
    voter: storage.poll.get(cid)!.voter,
  };
}

function getModelsByRound(round: number | BigNumber, s: DaoStorage) {
  return [...s.pool.keys()]
    .filter((cid) => s.pool.get(cid)!.round.eq(round))
    .map((c) => getModelInfo(c, s));
}

export function getQuorum(s: DaoStorage) {
  return s.quorum[2].div(s.quorum[3]).multipliedBy(100).toNumber();
}

export function getSuperMajority(s: DaoStorage) {
  return s.super_majority[4]
    .div(s.super_majority[5])
    .multipliedBy(100)
    .decimalPlaces(2)
    .toNumber();
}

export function getPoint(s: DaoStorage, address: string) {
  try {
    return s.member.get(address)?.toNumber() ?? "0";
  } catch (error) {
    return "0";
  }
}

export function getModelsInCurrentRound(s: DaoStorage) {
  return getModelsByRound(s.current_round, s);
}

export function getLastestAcceptedModels(s: DaoStorage) {
  return getModelsByRound(s.current_round.minus(1), s).filter(
    (m) => m.isAccepted
  );
}

export type ModelView = ReturnType<typeof getModelInfo>;

interface PoolValue {
  nbsamples: BigNumber;
  owner: string;
  round: BigNumber;
  accepted: boolean;
}

interface PollValue {
  accept_point: BigNumber;
  reject_point: BigNumber;
  abstain_point: BigNumber;
  voter: string[];
}

export interface DaoStorage {
  model_topo_cid: string;
  init_weights_cid: string;
  quorum: Record<"2" | "3", BigNumber>;
  super_majority: Record<"4" | "5", BigNumber>;
  fraction_of_members: Record<"6" | "7", BigNumber>;
  min_models: BigNumber;
  reward_point: BigNumber;
  current_round: BigNumber;
  member: MichelsonMap<string, BigNumber>;
  pool: MichelsonMap<string, PoolValue>;
  poll: MichelsonMap<string, PollValue>;
}
