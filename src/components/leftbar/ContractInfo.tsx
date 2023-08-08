import { Settings } from "@suid/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@suid/material";
import { Show } from "solid-js";
import appConfig from "../../config";
import { address, availablePoint } from "../../store/account";
import { balance, storage } from "../../store/contract";
import CopyBtn from "../utils/CopyBtn";
import OnHoverPopover from "../utils/OnHoverPopover";

export default function ContractInfo() {
  return (
    <>
      <ListItem dense>
        <ListItemIcon>
          <Settings color="info" />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="button">Contract Info:</Typography>}
        />
      </ListItem>
      <ListItem
        dense
        secondaryAction={appConfig.VITE_CONTRACT_ADDRESS.slice(0, 10) + "..."}
      >
        <ListItemText
          primary={
            <Typography variant="overline">
              Address: <CopyBtn value={appConfig.VITE_CONTRACT_ADDRESS} />
            </Typography>
          }
        />
      </ListItem>
      <Show
        when={storage() != null}
        fallback={
          <Stack spacing={1} sx={{ p: 1 }}>
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />
          </Stack>
        }
      >
        <ListItem
          dense
          secondaryAction={
            storage()!.members.find((m) => m.address == address()!)?.point ??
            "0"
          }
        >
          <ListItemText
            primary={
              <Typography variant="overline">
                Your Contribution Point:
              </Typography>
            }
          />
        </ListItem>
        <ListItem dense secondaryAction={storage()?.currentRound}>
          <ListItemText
            primary={<Typography variant="overline">Current Round:</Typography>}
          />
        </ListItem>
        <OnHoverPopover content="Minimum participation rate for voting results to be valid">
          <ListItem dense secondaryAction={`${storage()!.quorum * 100}%`}>
            <ListItemText
              primary={<Typography variant="overline">Quorum:</Typography>}
            />
          </ListItem>
        </OnHoverPopover>
        <OnHoverPopover content="Minimum accept rate for the model to be selected">
          <ListItem
            dense
            secondaryAction={`${Math.round(storage()!.superMajority * 100)}%`}
          >
            <ListItemText
              primary={
                <Typography variant="overline">Super Majority:</Typography>
              }
            />
          </ListItem>
        </OnHoverPopover>
        <ListItem dense secondaryAction={balance() + " ꜩ"}>
          <ListItemText
            primary={<Typography variant="overline">Balance:</Typography>}
          />
        </ListItem>
        <OnHoverPopover content="The amount of points can be redeemed for ꜩ">
          <ListItem dense secondaryAction={availablePoint()}>
            <ListItemText
              primary={
                <Typography variant="overline">Available Reward:</Typography>
              }
            />
          </ListItem>
        </OnHoverPopover>
      </Show>
    </>
  );
}
