import type * as tf from "@tensorflow/tfjs";

export declare interface ModelUpdate {
  model: tf.LayersModel;
  numSamples: number;
}
/**
 * FedAvg algorithm
 * @param updates each local model update k contain a set of weights w_k and number of training samples n_k
 * @returns new global model
 */
export default function fedAvg(updates: ModelUpdate[]) {
  if (updates[0] === undefined) throw new Error("Require at least 1 model")
  /**
   * n = sum(n_k)
   */
  const totalSamples = updates
    .map((m) => m.numSamples)
    .reduce((a, b) => a + b);
  /**
   * (n_k/n)*w_k
   */
  const addends = updates.map((u) =>
    u.model.getWeights().map((l) => l.mul(u.numSamples).div(totalSamples)),
  );
  const add2ModelWeights = (a: tf.Tensor[], b: tf.Tensor[]) =>
    a.map((layer, i) => layer.add(b[i]!));
  /**
   * return w = sum((n_k/n)*w_k)
   */
  const newWeights = addends.reduce(add2ModelWeights);
  updates[0].model.setWeights(newWeights);
  return updates[0].model;
}
