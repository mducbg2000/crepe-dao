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
  Input,
  Stack,
  Typography,
} from "@suid/material";
import { type DialogProps } from "@suid/material/Dialog";
import styled from "@suid/material/styles/styled";
import { Show, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { storage } from "../../reactive/contract";
import { globalModel } from "../../reactive/model";
import {
  getFeaturesAndLabels,
  getLastestGlobalModel,
} from "../../services/io-service";

const FileInput = styled("input")({
  display: "none",
});

type TrainParams = {
  csv?: File;
  epochs: number;
};

export default function TrainModelDialog(props: DialogProps) {
  const [state, setState] = createStore<TrainParams>({ epochs: 20 });

  const fit = async (params: TrainParams) => {
    if (params.csv === undefined) return undefined;
    const globalModel = await getLastestGlobalModel(storage()!);
    const { features, labels } = await getFeaturesAndLabels(params.csv);
    const history = await globalModel.fit(features, labels, {
      epochs: params.epochs,
    });
    return history.history["loss"]?.pop() as number;
  };

  const [trainingResult, { refetch }] = createResource(state, fit);

  return (
    <>
      <Dialog {...props}>
        <DialogTitle>Evaluate Model</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box justifyContent="space-between" displayRaw="flex">
              <Typography variant="overline">Dataset: </Typography>
              <Show when={state.csv !== undefined}>
                <Chip
                  label={state.csv?.name}
                  onDelete={() => {
                    setState("csv", undefined);
                  }}
                />
              </Show>
            </Box>
            <Box justifyContent="space-between" displayRaw="flex">
              <Typography variant="overline">Epochs: </Typography>
              <Input
                value={state.epochs}
                type="number"
                placeholder="Number of epoch"
                required
                onChange={(e) =>
                  setState("epochs", parseInt(e.target.value) ?? 20)
                }
              />
            </Box>
            <Box justifyContent="space-between" displayRaw="flex">
              <Typography variant="overline">Train result: </Typography>
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
            <label for="dataset">
              <FileInput
                accept=".csv"
                id="dataset"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.item(0) ?? undefined;
                  setState("csv", file);
                }}
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
              onClick={() => refetch()}
            >
              Start Training
            </Button>
            <Button
              variant="outlined"
              endIcon={<Save />}
              disabled={trainingResult() === undefined}
              onClick={() => globalModel()?.save("downloads://new")}
            >
              Export
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
