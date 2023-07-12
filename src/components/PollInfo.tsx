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
import { storage } from "../global/contract";
import { loadModel } from "../services/io-service";
import {
  getQuorum,
  getSuperMajority,
  getTotalPoint,
  type ModelView,
} from "../services/storage-service";
import EvaluateModelDialog from "./utils/EvaluateModelDialog";
import OnHoverPopover from "./utils/OnHoverPopover";
import VoteModelDialog from "./utils/VoteModelDialog";

export default function PollInfo(props: { model: ModelView }) {
  const voteResultsDetail = (): Array<{
    label: string;
    value: number;
    description: string;
    color: LinearProgressTypeMap["props"]["color"];
  }> => [
    {
      label: "Accept",
      value: (props.model.acceptPoint / getTotalPoint(storage()!)) * 100,
      color: "success",
      description: `${props.model.acceptPoint} / ${getTotalPoint(
        storage()!,
      )} (${Math.round(
        (props.model.acceptPoint / getTotalPoint(storage()!)) * 100,
      )}%)`,
    },
    {
      label: "Reject",
      value: (props.model.rejectPoint / getTotalPoint(storage()!)) * 100,
      color: "error",
      description: `${props.model.rejectPoint} / ${getTotalPoint(
        storage()!,
      )} (${Math.round(
        (props.model.rejectPoint / getTotalPoint(storage()!)) * 100,
      )}%)`,
    },
    {
      label: "Abstain",
      value: (props.model.abstainPoint / getTotalPoint(storage()!)) * 100,
      color: "warning",
      description: `${props.model.abstainPoint} / ${getTotalPoint(
        storage()!,
      )} (${Math.round(
        (props.model.abstainPoint / getTotalPoint(storage()!)) * 100,
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
      value:
        ((props.model.acceptPoint +
          props.model.rejectPoint +
          props.model.abstainPoint) /
          getTotalPoint(storage()!)) *
        100,
      color:
        ((props.model.acceptPoint +
          props.model.rejectPoint +
          props.model.abstainPoint) /
          getTotalPoint(storage()!)) *
          100 <
        getQuorum(storage()!)
          ? "info"
          : "success",
      description: `(${props.model.acceptPoint} +
          ${props.model.rejectPoint} +
          ${props.model.abstainPoint}) /
        ${getTotalPoint(storage()!)} (${Math.round(
          ((props.model.acceptPoint +
            props.model.rejectPoint +
            props.model.abstainPoint) /
            getTotalPoint(storage()!)) *
            100,
        )}%)`,
    },
    {
      label: "Accept Rate",
      value:
        (props.model.acceptPoint /
          (props.model.acceptPoint + props.model.rejectPoint)) *
        100,
      color:
        new BigNumber(
          props.model.acceptPoint /
            (props.model.acceptPoint + props.model.rejectPoint),
        )
          .multipliedBy(100)
          .decimalPlaces(2)
          .toNumber() < getSuperMajority(storage()!)
          ? "info"
          : "success",
      description: `${props.model.acceptPoint} /
        (${props.model.acceptPoint} + ${props.model.rejectPoint}) (${Math.round(
          (props.model.acceptPoint /
            (props.model.acceptPoint + props.model.rejectPoint)) *
            100,
        )}%)`,
    },
  ];

  const [showDetail, setShowDetail] = createSignal(false);
  const [openEvaluateDialog, setOpenEvaluateDialog] = createSignal(false);
  const [openVoteDialog, setOpenVoteDialog] = createSignal(false);
  const [model] = createResource(async () =>
    loadModel(storage()!.model_topo_cid, props.model.ipfsCid),
  );
  return (
    <Card raised>
      <EvaluateModelDialog
        open={openEvaluateDialog()}
        modelCid={props.model.ipfsCid}
        model={model()!}
        onClose={() => setOpenEvaluateDialog(false)}
      />
      <VoteModelDialog
        open={openVoteDialog()}
        modelCid={props.model.ipfsCid}
        onClose={() => setOpenVoteDialog(false)}
      />
      <CardHeader
        title={
          <Button
            endIcon={<Download />}
            color="secondary"
            sx={{ textTransform: "none" }}
            disabled={model.loading}
            onClick={() => model()?.save(`weights://${props.model.ipfsCid}`)}
          >
            <Typography variant="h6">{props.model.ipfsCid}</Typography>
          </Button>
        }
        action={
          <Show
            when={!props.model.isAccepted}
            fallback={<Alert>Accepted</Alert>}
          >
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
              label={props.model.owner}
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
          when={
            props.model.voter.includes(address()!) || props.model.isAccepted
          }
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
              props.model.isAccepted
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
