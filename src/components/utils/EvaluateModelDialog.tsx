import { Fingerprint, UploadFile } from "@suid/icons-material";
import {
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
import { LayersModel, Scalar } from "@tensorflow/tfjs";
import { Show, createResource, createSignal } from "solid-js";
import { getFeaturesAndLabels } from "../../services/io-service";
import { setAlertInfo } from "./Notification";

const Input = styled("input")({
  display: "none",
});
type EvaluateModelDialogProps = {
  modelCid: string;
  model: LayersModel;
} & DialogProps;

export default function EvaluateModelDialog(props: EvaluateModelDialogProps) {
  const [datasetFile, setDatasetFile] = createSignal<File>();
  const evaluate = async (csv?: File) => {
    try {
      if (csv === undefined) return undefined;
      const { features, labels } = await getFeaturesAndLabels(csv);
      const loss = props.model.evaluate(features, labels) as Scalar;
      setAlertInfo();
      return loss.dataSync().toString();
    } catch (err) {
      setAlertInfo(() => ({
        severity: "error",
        content: (err as Error).toString(),
      }));
      return undefined;
    }
  };
  const [result] = createResource(datasetFile, evaluate);
  return (
    <Dialog {...props}>
      <DialogTitle>Evaluate Model</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Chip
            color="secondary"
            icon={<Fingerprint />}
            label={props.modelCid}
          />
          <Box justifyContent="space-between" displayRaw="flex">
            <Typography variant="overline">Dataset: </Typography>
            <Show when={datasetFile() !== undefined}>
              <Chip
                label={datasetFile()?.name}
                onDelete={() => {
                  setDatasetFile();
                }}
              />
            </Show>
          </Box>
          <Box justifyContent="space-between" displayRaw="flex">
            <Typography variant="overline">Mean Square Error: </Typography>
            <Show when={datasetFile() !== undefined}>
              <Show when={!result.loading} fallback={<CircularProgress />}>
                <Chip label={result()} />
              </Show>
            </Show>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <label for="dataset">
          <Input
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
          >
            Select CSV Dataset
          </Button>
        </label>
      </DialogActions>
    </Dialog>
  );
}
