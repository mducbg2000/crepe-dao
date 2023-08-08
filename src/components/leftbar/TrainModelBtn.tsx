import { Psychology } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import TrainModelDialog, { setOpenTrainDialog } from "../TrainModelDialog";
import OnHoverPopover from "../utils/OnHoverPopover";

export default function TrainModelBtn() {
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
      <TrainModelDialog />
    </>
  );
}
