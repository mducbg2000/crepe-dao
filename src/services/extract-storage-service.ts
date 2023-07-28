import { DaoState } from "./serialized-service";

function getModelInfo(cid: string, storage: DaoState) {
  const acceptPoint = storage.poll.get(cid)!.accept_point;
  const rejectPoint = storage.poll.get(cid)!.reject_point;
  const abstainPoint = storage.poll.get(cid)!.abstain_point;

  return {
    ipfsCid: cid,
    owner: storage.pool.get(cid)!.owner,
    round: storage.pool.get(cid)!.round,
    isAccepted: storage.pool.get(cid)!.accepted,
    numberOfSamples: storage.pool.get(cid)!.nbsamples,
    acceptPoint,
    rejectPoint,
    abstainPoint,
    voter: storage.poll.get(cid)!.voter,
  };
}

function getModelsByRound(round: number, s: DaoState) {
  return [...s.pool.keys()]
    .filter((cid) => s.pool.get(cid)!.round === round)
    .map((c) => getModelInfo(c, s));
}

export function getTotalPoint(s: DaoState) {
  return [...s.member.values()].reduce((a, b) => a + b);
}

export function getPoint(s: DaoState, address: string) {
  return s.member.get(address) ?? 0;
}

export function getModelsInCurrentRound(s: DaoState) {
  return getModelsByRound(s.currentRound, s);
}

export function getLastestAcceptedModels(s: DaoState) {
  return getModelsByRound(s.currentRound - 1, s).filter((m) => m.isAccepted);
}

export type ModelView = ReturnType<typeof getModelInfo>;
