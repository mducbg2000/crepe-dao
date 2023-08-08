import { AccountBalanceWallet } from "@suid/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@suid/material";
import { address, balance } from "../../store/account";
import CopyBtn from "../utils/CopyBtn";

export default function AccountInfo() {
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <AccountBalanceWallet color="info" />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="button">Account Info:</Typography>}
        />
      </ListItem>
      <ListItem
        dense
        secondaryAction={
          <Typography textOverflow="ellipsis" overflow="clip">
            {address()?.slice(0, 10) + "..."}
          </Typography>
        }
      >
        <ListItemText
          primary={
            <Typography variant="overline">
              Address: <CopyBtn value={address()} />
            </Typography>
          }
        />
      </ListItem>
      <ListItem dense secondaryAction={balance() + " ꜩ"}>
        <ListItemText
          primary={<Typography variant="overline">Balance:</Typography>}
        />
      </ListItem>
    </>
  );
}
