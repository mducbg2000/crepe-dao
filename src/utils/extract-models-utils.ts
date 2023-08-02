import { DaoState } from "./serialized-storage-utils";

const getModelInfo = (cid: string, storage: DaoState) => ({
  ipfsCid: cid,
  owner: storage.pool.get(cid)!.owner,
  round: storage.pool.get(cid)!.round,
  isAccepted: storage.pool.get(cid)!.accepted,
  numberOfSamples: storage.pool.get(cid)!.nbsamples,
  acceptPoint: storage.poll.get(cid)!.accept_point,
  rejectPoint: storage.poll.get(cid)!.reject_point,
  abstainPoint: storage.poll.get(cid)!.abstain_point,
  voter: storage.poll.get(cid)!.voter,
});

const getModelsByRound = (round: number, s: DaoState) =>
  [...s.pool.keys()]
    .filter((cid) => s.pool.get(cid)!.round === round)
    .map((c) => getModelInfo(c, s));

export const getModelsInCurrentRound = (s: DaoState) =>
  getModelsByRound(s.currentRound, s);

export const getLastestAcceptedModels = (s: DaoState) =>
  getModelsByRound(s.currentRound - 1, s).filter((m) => m.isAccepted);

export type ModelView = ReturnType<typeof getModelInfo>;
