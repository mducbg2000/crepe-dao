import { Divider, Drawer, List, Stack, Toolbar } from "@suid/material";

import AccountInfo from "./leftbar/AccountInfo";
import DaoSetting from "./leftbar/DaoSetting";
import DownloadGlobalModelBtn from "./leftbar/DownloadGlobalModelBtn";
import TrainModelBtn from "./leftbar/TrainModelBtn";
import UploadModelBtn from "./leftbar/UploadModelBtn";

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
      <List>
        <Stack divider={<Divider variant="middle" />}>
          <AccountInfo />
          <DaoSetting />
          <DownloadGlobalModelBtn />
          <TrainModelBtn />
          <UploadModelBtn />
        </Stack>
      </List>
    </Drawer>
  );
}
