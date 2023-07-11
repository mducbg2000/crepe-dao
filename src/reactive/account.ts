import { InMemorySigner } from "@taquito/signer";
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { tezosClient } from "../services/contract-service";

export const [privateKey, setPrivateKey] = createSignal(
  window.localStorage.getItem("private-key") ?? ""
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
  }
);
