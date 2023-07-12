import { Download } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";

import { createResource } from "solid-js";
import { storage } from "../../global/contract";
import { getLastestGlobalModel } from "../../services/io-service";
import OnHoverPopover from "../utils/OnHoverPopover";

export default function DownloadGlobalModelBtn() {
  const [globalModel] = createResource(storage, getLastestGlobalModel);
  return (
    <OnHoverPopover content="Download lastest global model">
      <ListItem disablePadding>
        <ListItemButton
          disabled={globalModel() === undefined}
          onClick={() => globalModel()!.save("weights://lastest")}
        >
          <ListItemIcon>
            <Download color="info" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="button">Global Model</Typography>}
          />
        </ListItemButton>
      </ListItem>
    </OnHoverPopover>
  );
}
