import { Download } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";

import { globalModel, setGlobalModel } from "../../reactive/model";
import OnHoverPopover from "../utils/OnHoverPopover";

export default function DownloadGlobalModelBtn() {
  const downloadLastestGlobalModel = async () => {
    await setGlobalModel.refetch();
    globalModel()?.save("downloads://lastest-global");
  };
  return (
    <OnHoverPopover content="Download lastest global model">
      <ListItem disablePadding>
        <ListItemButton
          disabled={globalModel() === undefined}
          onClick={downloadLastestGlobalModel}
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
