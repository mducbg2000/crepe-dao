import { UploadFile } from "@suid/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@suid/material";
import { type DialogProps } from "@suid/material/Dialog";
import styled from "@suid/material/styles/styled";
import { ErrorBoundary, Show, createResource, createSignal } from "solid-js";
import { setStorage } from "../../global/contract";
import { addLocalModel } from "../../services/contract-service";
import { getFeaturesAndLabels } from "../../services/io-service";
import { addFile } from "../../services/ipfs-service";
import { setBlockLoading } from "../TopBar";
import { setAlertInfo } from "./Notification";

const InputFile = styled("input")({
  display: "none",
});

export default function UploadModelDialog(props: DialogProps) {
  const [datasetFile, setDatasetFile] = createSignal<File>();
  const [weightsFile, setWeightsFile] = createSignal<File>();

  const [numSamples] = createResource(datasetFile, async (csv?: File) => {
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
  });

  const upload = async () => {
    try {
      setBlockLoading(true);
      const cid = await addFile(weightsFile()!);
      await addLocalModel(cid, numSamples()!);
      await setStorage.refetch();
      setAlertInfo(() => ({
        severity: "success",
        content: "Successful add model to blockchain",
      }));
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
    <Dialog {...props}>
      <DialogTitle>Upload Model</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box justifyContent="space-between" displayRaw="flex">
            <Typography variant="overline">Trained Dataset: </Typography>
            <Show when={datasetFile() !== undefined}>
              <Chip
                label={datasetFile()?.name}
                onDelete={() => {
                  setDatasetFile();
                }}
              />
            </Show>
          </Box>

          <Show when={datasetFile() !== undefined}>
            <Box justifyContent="space-between" displayRaw="flex">
              <Typography variant="overline">Number of Samples:</Typography>
              <Show when={!numSamples.loading} fallback={<CircularProgress />}>
                <ErrorBoundary
                  fallback={(err) => (
                    <Alert severity="error">{(err as Error).toString()}</Alert>
                  )}
                >
                  <Chip label={numSamples()} />
                </ErrorBoundary>
              </Show>
            </Box>
          </Show>

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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <label for="dataset">
            <InputFile
              accept=".csv"
              id="dataset"
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
              endIcon={<UploadFile />}
              variant="outlined"
            >
              Select CSV Dataset
            </Button>
          </label>
          <label for="weights">
            <InputFile
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
              endIcon={<UploadFile />}
            >
              Select Binary Weights
            </Button>
          </label>
          <Button
            color="primary"
            endIcon={<UploadFile />}
            variant="outlined"
            disabled={numSamples() === undefined || weightsFile() === undefined}
            onClick={upload}
          >
            Upload
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
