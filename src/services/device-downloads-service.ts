import * as tf from "@tensorflow/tfjs";

const DEFAULT_FILE_NAME_PREFIX = "model";
const DEFAULT_JSON_EXTENSION_NAME = ".json";
const DEFAULT_WEIGHT_DATA_EXTENSION_NAME = ".weights.bin";

function defer<T>(f: () => T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve)).then(f);
}

export class DeviceDownloads implements tf.io.IOHandler {
  private readonly weightDataFileName: string;
  private readonly modelJsonFileName: string;
  private readonly weightDataAnchor: HTMLAnchorElement =
    document.createElement("a");
  private readonly modelJsonAnchor: HTMLAnchorElement =
    document.createElement("a");

  static readonly URL_SCHEME = "device://";

  constructor(fileNamePrefix?: string) {
    if (fileNamePrefix == null || fileNamePrefix.length === 0) {
      fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
    }
    if (fileNamePrefix.startsWith(DeviceDownloads.URL_SCHEME)) {
      fileNamePrefix = fileNamePrefix.slice(DeviceDownloads.URL_SCHEME.length);
    }
    this.modelJsonFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.weightDataFileName =
      fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
  }

  async save(modelArtifacts: tf.io.ModelArtifacts): Promise<tf.io.SaveResult> {
    if (typeof document === "undefined") {
      throw new Error(
        "Browser downloads are not supported in " +
          "this environment since `document` is not present",
      );
    }

    const weightBuffer = tf.io.CompositeArrayBuffer.join(
      modelArtifacts.weightData,
    );

    const weightsURL = window.URL.createObjectURL(
      new Blob([weightBuffer], { type: "application/octet-stream" }),
    );

    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
        "BrowserDownloads.save() does not support saving model topology " +
          "in binary formats yet.",
      );
    } else {
      const weightsManifest: tf.io.WeightsManifestConfig = [
        {
          paths: ["./" + this.weightDataFileName],
          weights: modelArtifacts.weightSpecs ?? [],
        },
      ];
      const modelJSON: tf.io.ModelJSON = getModelJSONForModelArtifacts(
        modelArtifacts,
        weightsManifest,
      );

      const modelJsonURL = window.URL.createObjectURL(
        new Blob([JSON.stringify(modelJSON)], { type: "application/json" }),
      );

      const jsonAnchor = this.modelJsonAnchor
      jsonAnchor.download = this.modelJsonFileName;
      jsonAnchor.href = modelJsonURL;

      await defer(() => jsonAnchor.dispatchEvent(new MouseEvent("click")));
      if (modelArtifacts.weightData != null) {
        const weightDataAnchor = this.weightDataAnchor;

        weightDataAnchor.download = this.weightDataFileName;
        weightDataAnchor.href = weightsURL;
        await defer(() =>
          weightDataAnchor.dispatchEvent(new MouseEvent("click")),
        );
      }

      return {
        modelArtifactsInfo: tf.io.getModelArtifactsInfoForJSON(modelArtifacts),
      };
    }
  }
}

export const deviceDownloadsRouter = (url: string | string[]) => {
  if (!Array.isArray(url) && url.startsWith(DeviceDownloads.URL_SCHEME)) {
    return deviceDownloads(url.slice(DeviceDownloads.URL_SCHEME.length));
  } else {
    return null as unknown as tf.io.IOHandler;
  }
};

tf.io.registerSaveRouter(deviceDownloadsRouter);

export function deviceDownloads(fileNamePrefix = "model"): tf.io.IOHandler {
  return new DeviceDownloads(fileNamePrefix);
}

export function getModelJSONForModelArtifacts(
  artifacts: tf.io.ModelArtifacts,
  manifest: tf.io.WeightsManifestConfig,
): tf.io.ModelJSON {
  const result: tf.io.ModelJSON = {
    modelTopology: artifacts.modelTopology!,
    weightsManifest: manifest,
  };
  if (artifacts.signature != null) {
    result.signature = artifacts.signature;
  }
  if (artifacts.userDefinedMetadata != null) {
    result.userDefinedMetadata = artifacts.userDefinedMetadata;
  }
  if (artifacts.modelInitializer != null) {
    result.modelInitializer = artifacts.modelInitializer;
  }
  if (artifacts.initializerSignature != null) {
    result.initializerSignature = artifacts.initializerSignature;
  }
  if (artifacts.trainingConfig != null) {
    result.trainingConfig = artifacts.trainingConfig;
  }
  return result;
}
