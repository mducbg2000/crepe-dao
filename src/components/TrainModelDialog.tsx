import { Psychology, Save, UploadFile } from "@suid/icons-material";
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
import styled from "@suid/material/styles/styled";
import { Scalar, Tensor } from "@tensorflow/tfjs";
import { Show, createResource, createSignal } from "solid-js";
import {
  getFeaturesAndLabels,
  getLastestGlobalModel,
} from "../services/io-service";
import { storage } from "../store/contract";

const FileInput = styled("input")({
  display: "none",
});
export const [openTrainDialog, setOpenTrainDialog] = createSignal(false);

export default function TrainModelDialog() {
  const [file, setFile] = createSignal<File>();
  const [globalModel, setGlobalModel] = createResource(
    storage,
    getLastestGlobalModel,
  );
  const [dataset] = createResource(file, async (dsFile: File) =>
    dsFile === undefined ? undefined : getFeaturesAndLabels(dsFile),
  );

  const fit = async (ds: { features: Tensor; labels: Tensor } | undefined) => {
    if (ds === undefined) return undefined;
    const { features, labels } = ds;
    (globalModel()!.evaluate(features, labels) as Scalar).print();
    await globalModel()!.fit(features, labels, {
      epochs: 40,
      shuffle: true,
    });
    return (globalModel()!.evaluate(features, labels) as Scalar)
      .dataSync()
      .toString();
  };

  const [trainingResult, setResult] = createResource(dataset, fit);

  return (
    <>
      <Dialog
        fullWidth
        open={openTrainDialog()}
        onClose={() => {
          setOpenTrainDialog(false);
          setGlobalModel.refetch();
          setResult.mutate();
          setFile();
        }}
      >
        <DialogTitle>Train Model</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box justifyContent="space-between" displayRaw="flex">
              <Typography variant="overline">Dataset: </Typography>
              <Show when={file() !== undefined}>
                <Chip label={file()?.name} />
              </Show>
            </Box>
            <Box justifyContent="space-between" displayRaw="flex">
              <Typography variant="overline">
                Train result (Last MSE value):
              </Typography>
              <Show
                when={!trainingResult.loading}
                fallback={<CircularProgress />}
              >
                <Chip label={trainingResult()} />
              </Show>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} direction="row">
            <label for="trainset">
              <FileInput
                accept=".csv"
                id="trainset"
                type="file"
                onChange={(e) =>
                  setFile(() => e.target.files?.item(0) ?? undefined)
                }
              />
              <Button
                color="primary"
                aria-label="upload dataset"
                component="span"
                variant="outlined"
                endIcon={<UploadFile />}
              >
                Select CSV Dataset
              </Button>
            </label>
            <Button
              variant="outlined"
              endIcon={<Psychology />}
              disabled={trainingResult() === undefined}
              onClick={setResult.refetch}
            >
              Training
            </Button>
            <Button
              variant="outlined"
              endIcon={<Save />}
              disabled={trainingResult() === undefined}
              onClick={() =>
                globalModel()!.save(`device://${file()!.name.slice(0, -4)}`)
              }
            >
              Export
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
