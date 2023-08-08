import { InMemorySigner } from "@taquito/signer";
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { tezosClient } from "../services/contract-service";
import { storage } from "./contract";

export const [privateKey, setPrivateKey] = createSignal(
  window.localStorage.getItem("private-key") ?? "",
);

export const signer = createMemo(() => {
  if (privateKey() === "") return undefined;
  try {
    return new InMemorySigner(privateKey());
  } catch (error) {
    return error as Error;
  }
});

createEffect(() => {
  if (signer() instanceof InMemorySigner) {
    const s = signer() as InMemorySigner;
    tezosClient.setSignerProvider(s);
    window.localStorage.setItem("private-key", privateKey());
  }
  if (privateKey() === "") window.localStorage.removeItem("private-key");
});

export const [address] = createResource(
  signer,
  async (s: ReturnType<typeof signer>) => {
    if (s instanceof InMemorySigner) return s.publicKeyHash();
    return undefined;
  },
);

const [balance, balanceAction] = createResource(
  address,
  async (address?: string) => {
    if (address === undefined) return 0;
    const b = await tezosClient.tz.getBalance(address);
    return b.div(1000000).toNumber();
  },
);

const refetchBalance = balanceAction.refetch;

export const point = () =>
  storage()?.members.find((m) => m.address == address()!)?.point ?? 0;

export const availablePoint = () =>
  point() -
  (storage()?.members.find((m) => m.address == address()!)?.withdrew ?? 0);

export { balance, refetchBalance };
