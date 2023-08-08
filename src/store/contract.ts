import { createResource } from "solid-js";
import { getContractBalance, getContractStorage } from "../services/io-service";

const [storage, storageAction] = createResource(getContractStorage);
const [balance, balanceAction] = createResource(getContractBalance);
const refetchStorage = storageAction.refetch;
const refetchBalance = balanceAction.refetch;

export { balance, refetchBalance, refetchStorage, storage };
