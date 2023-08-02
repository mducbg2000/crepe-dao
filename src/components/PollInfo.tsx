import {
  AccountBalanceWallet,
  Download,
  HowToVote,
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
import { address } from "../global/account";
import { storage } from "../global/contract-storage";
import { loadModel } from "../services/io-service";
import { type ModelView } from "../utils/extract-models-utils";
import CopyBtn from "./utils/CopyBtn";
import EvaluateModelDialog from "./utils/EvaluateModelDialog";
import OnHoverPopover from "./utils/OnHoverPopover";
import VoteModelDialog from "./utils/VoteModelDialog";

export default function PollInfo(props: { model: ModelView }) {
  const m = () => props.model;
  const total = () => [...storage()!.member.values()].reduce((a, b) => a + b);
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
          .toNumber() < storage()!.superMajority
          ? "info"
          : "success",
      description: `${m().acceptPoint} /
        (${m().acceptPoint} + ${m().rejectPoint}) (${Math.round(
          (m().acceptPoint / (m().acceptPoint + m().rejectPoint)) * 100,
        )}%)`,
    },
  ];

  const [showDetail, setShowDetail] = createSignal(false);
  const [openEvaluateDialog, setOpenEvaluateDialog] = createSignal(false);
  const [openVoteDialog, setOpenVoteDialog] = createSignal(false);
  const [model] = createResource(async () =>
    loadModel(storage()!.modelTopoCid, m().ipfsCid),
  );
  return (
    <Card raised>
      <EvaluateModelDialog
        open={openEvaluateDialog()}
        modelCid={m().ipfsCid}
        model={model()!}
        onClose={() => setOpenEvaluateDialog(false)}
      />
      <VoteModelDialog
        open={openVoteDialog()}
        modelCid={m().ipfsCid}
        onClose={() => setOpenVoteDialog(false)}
      />
      <CardHeader
        title={
          <>
            <Button
              endIcon={<Download />}
              color="secondary"
              sx={{ textTransform: "none" }}
              disabled={model.loading}
              onClick={() => model()?.save(`weights://${m().ipfsCid}`)}
            >
              <Typography variant="h6">{m().ipfsCid}</Typography>
            </Button>
            <CopyBtn value={m().ipfsCid} />
          </>
        }
        action={
          <Show when={!m().isAccepted} fallback={<Alert>Accepted</Alert>}>
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
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          endIcon={<Psychology />}
          sx={{ mr: 1 }}
          onClick={() => setOpenEvaluateDialog(true)}
          disabled={model.loading}
        >
          Evaluate
        </Button>
        <Show
          when={m().voter.includes(address()!) || m().isAccepted}
          fallback={
            <Button
              variant="outlined"
              endIcon={<HowToVote />}
              onClick={() => setOpenVoteDialog(true)}
            >
              Vote
            </Button>
          }
        >
          <OnHoverPopover
            content={
              m().isAccepted
                ? "Model has been accepted"
                : "You voted for this model"
            }
          >
            <Button variant="outlined" endIcon={<HowToVote />} disabled>
              Vote
            </Button>
          </OnHoverPopover>
        </Show>
      </CardActions>
    </Card>
  );
}
