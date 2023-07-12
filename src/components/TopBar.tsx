import { Logout } from "@suid/icons-material";
import {
  AppBar,
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
} from "@suid/material";
import { Show, createSignal } from "solid-js";

import crepeLogo from "../assets/logo.svg";
import appConfig from "../config";
import { setPrivateKey } from "../global/account";
import Notification from "./utils/Notification";
import OnHoverPopover from "./utils/OnHoverPopover";
export const [nonBlockLoading, setNonBlockLoading] = createSignal(false);
export const [blockLoading, setBlockLoading] = createSignal(false);
export default function TopBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1900 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <OnHoverPopover content="View contract on tzkt.io">
          <Stack spacing={1} direction="row">
            <Avatar src={crepeLogo} />
            <Typography
              sx={{
                width: "fit-content",
                cursor: "pointer",
                pt: "4px",
              }}
              variant="h6"
              noWrap
              onClick={() =>
                window.open(
                  `https://ghostnet.tzkt.io/${appConfig.VITE_CONTRACT_ADDRESS}`,
                )
              }
            >
              CrepeDao
            </Typography>
          </Stack>
        </OnHoverPopover>
        <Button
          color="inherit"
          size="large"
          endIcon={<Logout />}
          onClick={() => setPrivateKey("")}
          sx={{ float: "right" }}
        >
          Logout
        </Button>
      </Toolbar>
      <Show when={nonBlockLoading()}>
        <LinearProgress color="info" />
      </Show>
      <Backdrop
        open={blockLoading()}
        // sx={{ position: "relative", zIndex: 1500 }}
      >
        <CircularProgress />
      </Backdrop>
      <Notification />
    </AppBar>
  );
}
