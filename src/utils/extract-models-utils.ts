import { DaoState } from "./serialized-storage-utils";

const getModelsByRound = (round: number, s: DaoState) =>
  s.models
    .filter((m) => m.round === round)

export const getModelsInCurrentRound = (s: DaoState) =>
  getModelsByRound(s.currentRound, s);

export const getLastestAcceptedModels = (s: DaoState) =>
  getModelsByRound(s.currentRound - 1, s).filter((m) => m.accepted);
