import type * as tf from "@tensorflow/tfjs";
import { beforeEach, expect, test } from "vitest";
import fedAvg from "../src/services/ai-service";
import { loadModel } from "../src/services/io-service";

interface AiTestContext {
  model: tf.LayersModel;
}

beforeEach<AiTestContext>(async (context) => {
  context.model = await loadModel(
    "QmSAHEgh5NozH8ALJk11WP4SdKSC1pQwnrFJ7wadUkz1gS",
    "QmayScJpjfU2FBosY2EJYz81D5Cw5H7dd4RnfrNFhF7qXZ"
  );
});

test<AiTestContext>("Aggregate models weights", ({ model }) => {
  const updates = [
    {
      models: model,
      numSamples: 25,
    },
    {
      models: model,
      numSamples: 30,
    },
  ];
  expect(() => {
    const newWeights = fedAvg(updates);
    model.setWeights(newWeights);
  }).not.toThrow();
});
