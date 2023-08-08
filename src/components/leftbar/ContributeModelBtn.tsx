import { AddCircle } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import ContributeModelDialog, {
  setOpenUploadDialog,
} from "../ContributeModelDialog";
import OnHoverPopover from "../utils/OnHoverPopover";

export default function UploadModelBtn() {
  return (
    <>
      <OnHoverPopover content="Upload new local model to contract">
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenUploadDialog(true)}>
            <ListItemIcon>
              <AddCircle color="info" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="button">Contribute Model</Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </OnHoverPopover>
      <ContributeModelDialog />
    </>
  );
}
