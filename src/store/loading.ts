import { createSignal } from "solid-js";

export const [nonBlockLoading, setNonBlockLoading] = createSignal(false);
export const [blockLoading, setBlockLoading] = createSignal(false);
