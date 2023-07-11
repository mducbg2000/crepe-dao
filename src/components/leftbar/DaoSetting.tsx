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
import { address } from "../../reactive/account";
import { storage } from "../../reactive/contract";
import {
  getPoint,
  getQuorum,
  getSuperMajority,
} from "../../services/storage-service";
import OnHoverPopover from "../utils/OnHoverPopover";

export default function DaoSetting() {
  return (
    <>
      <ListItem dense>
        <ListItemIcon>
          <Settings color="info" />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="button">DAO Settings:</Typography>}
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
          </Stack>
        }
      >
        <ListItem dense secondaryAction={getPoint(storage()!, address() ?? "")}>
          <ListItemText
            primary={<Typography variant="overline">Your Point:</Typography>}
          />
        </ListItem>
        <ListItem dense secondaryAction={storage()?.current_round.toNumber()}>
          <ListItemText
            primary={<Typography variant="overline">Current Round:</Typography>}
          />
        </ListItem>
        <OnHoverPopover content="Minimum participation rate for voting results to be valid">
          <ListItem dense secondaryAction={`${getQuorum(storage()!)}%`}>
            <ListItemText
              primary={<Typography variant="overline">Quorum:</Typography>}
            />
          </ListItem>
        </OnHoverPopover>
        <OnHoverPopover content="Minimum accept rate for the model to be selected">
          <ListItem
            dense
            secondaryAction={`${Math.round(getSuperMajority(storage()!))}%`}
          >
            <ListItemText
              primary={
                <Typography variant="overline">Super Majority:</Typography>
              }
            />
          </ListItem>
        </OnHoverPopover>
      </Show>
    </>
  );
}