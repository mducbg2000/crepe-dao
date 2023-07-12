import { Psychology } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import { createSignal } from "solid-js";
import OnHoverPopover from "../utils/OnHoverPopover";
import TrainModelDialog from "../utils/TrainModelDialog";

export default function TrainModelBtn() {
  const [openTrainDialog, setOpenTrainDialog] = createSignal(false);
  return (
    <>
      <OnHoverPopover content="Continue training model from lastest global model with your own dataset">
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenTrainDialog(true)}>
            <ListItemIcon>
              <Psychology color="info" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Train Model</Typography>}
            />
          </ListItemButton>
        </ListItem>
      </OnHoverPopover>
      <TrainModelDialog
        fullWidth
        open={openTrainDialog()}
        onClose={() => setOpenTrainDialog(false)}
      />
    </>
  );
}
