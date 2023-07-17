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
import DaoSetting from "./leftbar/DaoSetting";
import DownloadGlobalModelBtn from "./leftbar/DownloadGlobalModelBtn";
import TrainModelBtn from "./leftbar/TrainModelBtn";
import UploadModelBtn from "./leftbar/UploadModelBtn";
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
          <DaoSetting />
          <DownloadGlobalModelBtn />
          <TrainModelBtn />
          <UploadModelBtn />
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
