import * as tf from "@tensorflow/tfjs";
import appConfig from "../config";
import { getLastestAcceptedModels } from "../utils/extract-models-utils";
import {
  DaoState,
  DaoStateRaw,
  toDaoState,
} from "../utils/serialized-storage-utils";
import { ModelUpdate, fedAvg } from "./ai-service";
import { contractLoader, tezosClient } from "./contract-service";
import { retrieveFile } from "./ipfs-service";

export const getModel = async (modelTopoCid: string, weightsCid: string) => {
  const getWeightsData = async (
    weightsManifest: tf.io.WeightsManifestConfig,
    weightsCid: string,
  ): Promise<[tf.io.WeightsManifestEntry[], ArrayBuffer]> => {
    const buffer = (await retrieveFile(weightsCid)) as ArrayBuffer;
    const weightSpecs = tf.io.getWeightSpecs(weightsManifest);
    return [weightSpecs, buffer];
  };

  const loadModelArtifacts = async (topoCid: string, weightsCid: string) => {
    const modelJSON = (await retrieveFile(topoCid, "json")) as tf.io.ModelJSON;
    return tf.io.getModelArtifactsForJSON(modelJSON, (weightsManifest) =>
      getWeightsData(weightsManifest, weightsCid),
    );
  };

  const loader: tf.io.IOHandler = {
    load: async () => loadModelArtifacts(modelTopoCid, weightsCid),
  };
  const model = await tf.loadLayersModel(loader);
  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: tf.metrics.meanSquaredError,
  });
  return model;
};

type CsvRow = {
  xs: {
    [x: string]: number;
  };
  ys: {
    [y: string]: number;
  };
};

export const getFeaturesAndLabels = async (
  csvFile: tf.data.FileDataSource["input"],
) => {
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
};

export const getLastestGlobalModel = async (s: DaoState) => {
  const lastestAcceptedModels = getLastestAcceptedModels(s);
  return lastestAcceptedModels.length === 0
    ? await getModel(s.initTopoCid, s.initWeightsCid)
    : fedAvg(
        await Promise.all(
          lastestAcceptedModels.map(async (info) => {
            const model = await getModel(info.topoCID, info.weightsCID);
            return {
              model,
              numSamples: info.nbsamples,
            } satisfies ModelUpdate;
          }),
        ),
      );
};

export const getContractStorage = async (): Promise<DaoState> => {
  const contract = await contractLoader;
  const storage: DaoStateRaw = await contract.storage();
  return toDaoState(storage);
};

export const getContractBalance = async () => {
  const balance = await tezosClient.tz.getBalance(
    appConfig.VITE_CONTRACT_ADDRESS,
  );
  return balance.div(1000000).toNumber();
};
