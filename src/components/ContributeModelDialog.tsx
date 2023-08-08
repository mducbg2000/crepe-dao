import {
  AddCircle,
  DataArray,
  DataObject,
  FilePresent,
} from "@suid/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@suid/material";
import { ErrorBoundary, Show, createResource, createSignal } from "solid-js";
import { contributeLocalModel } from "../services/contract-service";
import { getFeaturesAndLabels } from "../services/io-service";
import { addFile } from "../services/ipfs-service";
import { refetchStorage } from "../store/contract";
import { setBlockLoading } from "../store/loading";
import { FileInput } from "./utils/FileInput";
import { setAlertInfo } from "./utils/Notification";

export const [openUploadDialog, setOpenUploadDialog] = createSignal(false);

export default function ContributeModelDialog() {
  const [datasetFile, setDatasetFile] = createSignal<File>();
  const [weightsFile, setWeightsFile] = createSignal<File>();
  const [topoFile, setTopoFile] = createSignal<File>();
  const [numSamples, { mutate }] = createResource(
    datasetFile,
    async (csv?: File) => {
      try {
        if (csv === undefined) return undefined;
        const { labels } = await getFeaturesAndLabels(csv);
        return labels.shape[0];
      } catch (err) {
        setAlertInfo(() => ({
          severity: "error",
          content: (err as Error).toString(),
        }));
        return undefined;
      }
    },
  );

  const contribute = async () => {
    try {
      setBlockLoading(true);
      const [topoCid, weightsCid] = await Promise.all([
        addFile(topoFile()!),
        addFile(weightsFile()!),
      ]);
      const result = await contributeLocalModel(
        topoCid,
        weightsCid,
        numSamples()!,
      );
      setOpenUploadDialog(false);

      setAlertInfo(() => ({
        severity: "success",
        content: (
          <>
            Contribute model successful at operation:&nbsp;
            <a
              href={`https://ghostnet.tzkt.io/${result}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result}
            </a>
          </>
        ),
      }));
      await refetchStorage();
    } catch (err) {
      setAlertInfo(() => ({
        severity: "error",
        content: (err as Error).toString(),
      }));
    } finally {
      setBlockLoading(false);
    }
  };

  return (
    <Dialog
      fullWidth
      open={openUploadDialog()}
      onClose={() => setOpenUploadDialog(false)}
    >
      <DialogTitle>Contribute Local Model</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box justifyContent="space-between" displayRaw="flex">
            <Typography variant="overline">Topology: </Typography>
            <Show when={topoFile() !== undefined}>
              <Chip
                label={topoFile()?.name}
                onDelete={() => {
                  setTopoFile();
                }}
              />
            </Show>
          </Box>
          <Box justifyContent="space-between" displayRaw="flex">
            <Typography variant="overline">Weights: </Typography>
            <Show when={weightsFile() !== undefined}>
              <Chip
                label={weightsFile()?.name}
                onDelete={() => {
                  setWeightsFile();
                }}
              />
            </Show>
          </Box>
          <Box justifyContent="space-between" displayRaw="flex">
            <Typography variant="overline">Number of Samples:</Typography>
            <Show when={numSamples() !== undefined}>
              <ErrorBoundary
                fallback={(err) => (
                  <Alert severity="error">{(err as Error).toString()}</Alert>
                )}
              >
                <Chip
                  label={numSamples()}
                  onDelete={() => {
                    mutate();
                  }}
                />
              </ErrorBoundary>
            </Show>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <label for="topo">
            <FileInput
              accept=".json"
              id="topo"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.item(0) ?? undefined;
                setTopoFile(() => file);
              }}
            />
            <Button
              color="primary"
              aria-label="upload dataset"
              component="span"
              variant="outlined"
              endIcon={<DataObject />}
            >
              Topology
            </Button>
          </label>
          <label for="weights">
            <FileInput
              accept=".weights.bin"
              id="weights"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.item(0) ?? undefined;
                setWeightsFile(() => file);
              }}
            />
            <Button
              color="primary"
              aria-label="upload dataset"
              component="span"
              variant="outlined"
              endIcon={<FilePresent />}
            >
              Weights
            </Button>
          </label>
          <label for="train-set">
            <FileInput
              accept=".csv"
              id="train-set"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.item(0) ?? undefined;
                setDatasetFile(() => file);
              }}
            />
            <Button
              color="primary"
              aria-label="upload dataset"
              component="span"
              endIcon={<DataArray />}
              variant="outlined"
            >
              Trainset
            </Button>
          </label>
          <Button
            color="primary"
            endIcon={<AddCircle />}
            variant="outlined"
            disabled={
              numSamples() === undefined ||
              weightsFile() === undefined ||
              topoFile() === undefined
            }
            onClick={contribute}
          >
            Contribute
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
