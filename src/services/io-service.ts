import * as tf from "@tensorflow/tfjs";
import fedAvg, { ModelUpdate } from "./ai-service";
import { retrieveFile } from "./ipfs-service";
import { DaoStorage, getLastestAcceptedModels } from "./storage-service";
async function getWeightsData(
  weightsManifest: tf.io.WeightsManifestConfig,
  weightsCid: string,
): Promise<[tf.io.WeightsManifestEntry[], ArrayBuffer]> {
  const buffer = (await retrieveFile(weightsCid)) as ArrayBuffer;
  const weightSpecs = tf.io.getWeightSpecs(weightsManifest);
  return [weightSpecs, buffer];
}

type CsvRow = {
  xs: {
    [x: string]: number;
  };
  ys: {
    [y: string]: number;
  };
};

async function loadModelArtifacts(topoCid: string, weightsCid: string) {
  const modelJSON = (await retrieveFile(topoCid, "json")) as tf.io.ModelJSON;
  return tf.io.getModelArtifactsForJSON(modelJSON, (weightsManifest) =>
    getWeightsData(weightsManifest, weightsCid),
  );
}

export async function loadModel(modelTopoCid: string, weightsCid: string) {
  const loader: tf.io.IOHandler = {
    load: async () => loadModelArtifacts(modelTopoCid, weightsCid),
  };
  const model = await tf.loadLayersModel(loader);
  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: tf.metrics.meanSquaredError,
  });
  return model;
}

export async function getFeaturesAndLabels(csvFile: File) {
  const csvDataset = new tf.data.CSVDataset(
    new tf.data.FileDataSource(csvFile),
    {
      hasHeader: true,
      columnConfigs: {
        MOS: {
          isLabel: true,
        },
        QoA_VLCresolution: { required: true },
        QoA_VLCbitrate: { required: true },
        QoA_VLCframerate: { required: true },
        QoA_VLCdropped: { required: true },
        QoA_VLCaudiorate: { required: true },
        QoA_VLCaudioloss: { required: true },
        QoA_BUFFERINGcount: { required: true },
        QoA_BUFFERINGtime: { required: true },
        QoS_type: { required: true },
        QoS_operator: { required: true },
        QoU_sex: { required: true },
        QoU_age: { required: true },
        QoU_Ustedy: { required: true },
        QoF_begin: { required: true },
        QoF_shift: { required: true },
        QoF_audio: { required: true },
        QoF_video: { required: true },
      },
      configuredColumnsOnly: true,
    },
  );

  const flattenedDatasets = await csvDataset
    .map((t) => {
      const r = t as CsvRow;
      return {
        xs: Object.values(r.xs),
        ys: Object.values(r.ys)[0]!,
      };
    })
    .toArray();
  const xRaw = flattenedDatasets.reduce((p: number[][], c) => [...p, c.xs], []);
  const yRaw = flattenedDatasets.reduce((p: number[], c) => [...p, c.ys], []);
  const x = tf.tensor(xRaw);
  const features = x.reshape([...x.shape, 1]);
  const labels = tf.tensor(yRaw);
  return { features, labels };
}

export async function getLastestGlobalModel(s: DaoStorage) {
  const lastestAcceptedModels = getLastestAcceptedModels(s);
  return lastestAcceptedModels.length === 0
    ? await loadModel(s.model_topo_cid, s.init_weights_cid)
    : fedAvg(
        await Promise.all(
          lastestAcceptedModels.map(async (info) => {
            const model = await loadModel(s.model_topo_cid, info.ipfsCid);
            return {
              model,
              numSamples: info.numberOfSamples,
            } satisfies ModelUpdate;
          }),
        ),
      );
}
