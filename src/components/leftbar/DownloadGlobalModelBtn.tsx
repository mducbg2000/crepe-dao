import { Save } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";

import { createResource } from "solid-js";
import { getLastestGlobalModel } from "../../services/io-service";
import { storage } from "../../store/contract";
import OnHoverPopover from "../utils/OnHoverPopover";

export default function DownloadGlobalModelBtn() {
  const [globalModel] = createResource(storage, getLastestGlobalModel);
  const saveGlobalModel = () => {
    globalModel()!.save("device://lastest", { includeOptimizer: false });
  };
  return (
    <OnHoverPopover content="Download lastest global model">
      <ListItem disablePadding>
        <ListItemButton
          disabled={globalModel() === undefined}
          onClick={saveGlobalModel}
        >
          <ListItemIcon>
            <Save color="info" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="button">Global Model</Typography>}
          />
        </ListItemButton>
      </ListItem>
    </OnHoverPopover>
  );
}
