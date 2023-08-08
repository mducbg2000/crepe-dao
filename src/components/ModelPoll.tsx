import {
  AccountBalanceWallet,
  HowToVote,
  Poll,
  Psychology,
} from "@suid/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@suid/material";
import LinearProgress, {
  type LinearProgressTypeMap,
} from "@suid/material/LinearProgress";
import BigNumber from "bignumber.js";
import { For, Show, createResource, createSignal } from "solid-js";
import { getFeaturesAndLabels, getModel } from "../services/io-service";
import { address } from "../store/account";
import { storage } from "../store/contract";

import { Scalar } from "@tensorflow/tfjs";
import { ModelInfo } from "../utils/serialized-storage-utils";
import { setVoteCID } from "./VoteModelDialog";
import CopyBtn from "./utils/CopyBtn";
import { FileInput } from "./utils/FileInput";
import OnHoverPopover from "./utils/OnHoverPopover";

export default function ModelPoll(props: { model: ModelInfo }) {
  const m = () => props.model;
  const total = () =>
    storage()
      ?.members.map((m) => m.point)
      .reduce((a, b) => a + b, 0) ?? 1;

  const [datasetFile, setDatasetFile] = createSignal<File>();
  const [showDetail, setShowDetail] = createSignal(false);
  const [model] = createResource(async () =>
    getModel(m().topoCID, m().weightsCID),
  );
  const [result] = createResource(datasetFile, async (file?: File) => {
    if (file === undefined) return undefined;
    try {
      const { features, labels } = await getFeaturesAndLabels(file);
      const loss = model()!.evaluate(features, labels) as Scalar;
      return loss.dataSync().toString();
    } catch (e) {
      return (e as Error).toString();
    }
  });
  const participationRate = () =>
    ((m().acceptPoint + m().rejectPoint + m().abstainPoint) / total()) * 100;

  const voteResultsDetail = (): Array<{
    label: string;
    value: number;
    description: string;
    color: LinearProgressTypeMap["props"]["color"];
  }> => [
    {
      label: "Accept",
      value: (m().acceptPoint / total()) * 100,
      color: "success",
      description: `${m().acceptPoint} / ${total()},
      )} (${Math.round((m().acceptPoint / total()) * 100)}%)`,
    },
    {
      label: "Reject",
      value: (m().rejectPoint / total()) * 100,
      color: "error",
      description: `${m().rejectPoint} / ${total()} (${Math.round(
        (m().rejectPoint / total()) * 100,
      )}%)`,
    },
    {
      label: "Abstain",
      value: (m().abstainPoint / total()) * 100,
      color: "warning",
      description: `${m().abstainPoint} / ${total()} (${Math.round(
        (m().abstainPoint / total()) * 100,
      )}%)`,
    },
  ];
  const voteResult = (): Array<{
    label: string;
    value: number;
    description: string;
    color: LinearProgressTypeMap["props"]["color"];
  }> => [
    {
      label: "Participation Rate",
      value: participationRate(),
      color: participationRate() < storage()!.quorum * 100 ? "info" : "success",
      description: `(${m().acceptPoint} +
          ${m().rejectPoint} +
          ${m().abstainPoint}) /
        ${total()} (${Math.round(participationRate())}%)`,
    },
    {
      label: "Accept Rate",
      value: (m().acceptPoint / (m().acceptPoint + m().rejectPoint)) * 100,
      color:
        new BigNumber(m().acceptPoint / (m().acceptPoint + m().rejectPoint))
          .multipliedBy(100)
          .decimalPlaces(2)
          .toNumber() <
        storage()!.superMajority * 100
          ? "info"
          : "success",
      description: `${m().acceptPoint} /
        (${m().acceptPoint} + ${m().rejectPoint}) (${Math.round(
          (m().acceptPoint / (m().acceptPoint + m().rejectPoint)) * 100,
        )}%)`,
    },
  ];

  return (
    <Card raised>
      <CardHeader
        title={
          <>
            <Button
              startIcon={<Poll />}
              color="secondary"
              sx={{ textTransform: "none" }}
              disabled={model.loading}
              onClick={() => model()!.save(`device://${m().id.slice(0, 8)}`)}
            >
              <OnHoverPopover content="Download Model">
                <Typography variant="h6">{`0x${m().id.slice(
                  0,
                  8,
                )}...`}</Typography>
              </OnHoverPopover>
            </Button>
            <CopyBtn value={m().id} />
          </>
        }
        action={
          <Show when={!m().accepted} fallback={<Alert>Accepted</Alert>}>
            <OnHoverPopover content="Participation or Accept rate have not reached the required">
              <Alert severity="info">Not Accepted Yet</Alert>
            </OnHoverPopover>
          </Show>
        }
      />
      <CardHeader
        title={
          <FormControlLabel
            control={
              <Switch
                checked={showDetail()}
                onChange={(_, value) => setShowDetail(value)}
              />
            }
            label="Detail"
            sx={{
              flexGrow: 1,
            }}
          />
        }
        action={
          <OnHoverPopover content="Owner address">
            <Chip
              color="info"
              icon={<AccountBalanceWallet />}
              label={m().owner}
              variant="outlined"
            />
          </OnHoverPopover>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <For each={showDetail() ? voteResultsDetail() : voteResult()}>
            {(item) => (
              <Box>
                <Box displayRaw="flex">
                  <Typography variant="button" noWrap sx={{ flexGrow: 1 }}>
                    {item.label}:
                  </Typography>
                  <Typography variant="overline">{item.description}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.value}
                  color={item.color ?? "info"}
                  sx={{
                    height: 10,
                    borderRadius: 20,
                  }}
                />
              </Box>
            )}
          </For>
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
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={2}>
          <label for={`test-${m().id}`}>
            <FileInput
              accept=".csv"
              id={`test-${m().id}`}
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
              endIcon={<Psychology />}
              variant="outlined"
            >
              Evaluate
            </Button>
          </label>
          <Show
            when={m().voters.includes(address()!) || m().accepted}
            fallback={
              <Button
                variant="outlined"
                endIcon={<HowToVote />}
                onClick={() => setVoteCID(() => m().id)}
              >
                Vote
              </Button>
            }
          >
            <OnHoverPopover
              content={
                m().accepted
                  ? "Model has been accepted"
                  : "You voted for this model"
              }
            >
              <Button variant="outlined" endIcon={<HowToVote />} disabled>
                Vote
              </Button>
            </OnHoverPopover>
          </Show>
        </Stack>
      </CardActions>
    </Card>
  );
}
