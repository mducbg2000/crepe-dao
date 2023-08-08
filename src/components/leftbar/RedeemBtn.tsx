import { Redeem } from "@suid/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import RedeemDialog, { setOpenRedeemDialog } from "../RedeemDialog";

export default function RedeemBtn() {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpenRedeemDialog(true)}>
          <ListItemIcon>
            <Redeem color="info" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="button">Earn Reward</Typography>}
          />
        </ListItemButton>
      </ListItem>
      <RedeemDialog />
    </>
  );
}
