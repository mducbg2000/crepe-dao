import * as tf from "@tensorflow/tfjs";

const DEFAULT_FILE_NAME_PREFIX = "model";
const DEFAULT_WEIGHT_DATA_EXTENSION_NAME = ".weights.bin";

function defer<T>(f: () => T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve)).then(f);
}

export class WeightsDownloads implements tf.io.IOHandler {
  private readonly weightDataFileName: string;
  private readonly weightDataAnchor: HTMLAnchorElement =
    document.createElement("a");

  static readonly URL_SCHEME = "weights://";

  constructor(fileNamePrefix?: string) {
    if (fileNamePrefix == null || fileNamePrefix.length === 0) {
      fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
    }
    if (fileNamePrefix.startsWith(WeightsDownloads.URL_SCHEME)) {
      fileNamePrefix = fileNamePrefix.slice(WeightsDownloads.URL_SCHEME.length);
    }
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

    // TODO(mattsoulanille): Support saving models over 2GB that exceed
    // Chrome's ArrayBuffer size limit.
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
      if (modelArtifacts.weightData != null) {
        const weightDataAnchor =
          this.weightDataAnchor ?? document.createElement("a");

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

export const browserDownloadsRouter = (url: string | string[]) => {
  if (!Array.isArray(url) && url.startsWith(WeightsDownloads.URL_SCHEME)) {
    return browserDownloads(url.slice(WeightsDownloads.URL_SCHEME.length));
  } else {
    return null as unknown as tf.io.IOHandler;
  }
};

tf.io.registerSaveRouter(browserDownloadsRouter);

export function browserDownloads(fileNamePrefix = "model"): tf.io.IOHandler {
  return new WeightsDownloads(fileNamePrefix);
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
