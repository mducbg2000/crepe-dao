import { UploadFile } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import { createSignal } from "solid-js";
import { globalModel } from "../../reactive/model";
import OnHoverPopover from "../utils/OnHoverPopover";
import UploadModelDialog from "../utils/UploadModelDialog";

export default function UploadModelBtn() {
  const [openUploadDialog, setOpenUploadDialog] = createSignal(false);
  return (
    <>
      <OnHoverPopover content="Upload new local model to contract">
        <ListItem disablePadding>
          <ListItemButton
            disabled={globalModel() === undefined}
            onClick={() => setOpenUploadDialog(true)}
          >
            <ListItemIcon>
              <UploadFile color="info" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Upload Model</Typography>}
            />
          </ListItemButton>
        </ListItem>
      </OnHoverPopover>
      <UploadModelDialog
        fullWidth
        open={openUploadDialog()}
        onClose={() => setOpenUploadDialog(false)}
      />
    </>
  );
}
