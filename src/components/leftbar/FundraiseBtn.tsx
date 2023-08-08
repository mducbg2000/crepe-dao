import { VolunteerActivism } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import FundraiseDialog, { setOpenFundraiseDialog } from "../FundraiseDialog";

export default function FundraiseBtn() {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpenFundraiseDialog(true)}>
          <ListItemIcon>
            <VolunteerActivism color="info" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="button">Fundraise</Typography>}
          />
        </ListItemButton>
      </ListItem>
      <FundraiseDialog />
    </>
  );
}
