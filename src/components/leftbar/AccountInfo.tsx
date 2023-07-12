import { AccountBalanceWallet } from "@suid/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import { address } from "../../global/account";

export default function AccountInfo() {
  return (
    <ListItem>
      <ListItemIcon>
        <AccountBalanceWallet color="info" />
      </ListItemIcon>
      <ListItemText
        primary={<Typography variant="button">Your Address:</Typography>}
        secondary={
          <Typography textOverflow="ellipsis" overflow="clip">
            {address()}
          </Typography>
        }
      />
    </ListItem>
  );
}
