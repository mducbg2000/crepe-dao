import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@suid/material";

import AccountInfo from "./leftbar/AccountInfo";
import ContractInfo from "./leftbar/ContractInfo";
import UploadModelBtn from "./leftbar/ContributeModelBtn";
import DownloadGlobalModelBtn from "./leftbar/DownloadGlobalModelBtn";
import FundraiseBtn from "./leftbar/FundraiseBtn";
import RedeemBtn from "./leftbar/RedeemBtn";
import TrainModelBtn from "./leftbar/TrainModelBtn";
import DocumentBtn from "./utils/DocumentBtn";

export default function LeftBar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        width: 300,
        [`& .MuiDrawer-paper`]: {
          width: 300,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List
        sx={{
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Stack divider={<Divider variant="middle" />}>
          <AccountInfo />
          <ContractInfo />
          <DownloadGlobalModelBtn />
          <TrainModelBtn />
          <UploadModelBtn />
          <FundraiseBtn />
          <RedeemBtn />
        </Stack>
        <ListItem secondaryAction={<DocumentBtn />}>
          <ListItemText
            primary={<Typography variant="overline">How to use: </Typography>}
          />
        </ListItem>
      </List>
    </Drawer>
  );
}
