import { Logout } from "@suid/icons-material";
import {
  AppBar,
  Backdrop,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Toolbar,
} from "@suid/material";
import { Show } from "solid-js";

import appConfig from "../config";
import { setPrivateKey } from "../store/account";
import { blockLoading, nonBlockLoading } from "../store/loading";
import Notification from "./utils/Notification";
import OnHoverPopover from "./utils/OnHoverPopover";

export default function TopBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1900 }}>
      <Show when={nonBlockLoading()}>
        <LinearProgress color="info" />
      </Show>
      <Backdrop open={blockLoading()}>
        <CircularProgress />
      </Backdrop>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <OnHoverPopover content="View contract on tzkt.io">
          <Stack spacing={1} direction="row">
            <a
              href={`https://ghostnet.tzkt.io/${appConfig.VITE_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/banner.svg" height="40px" />
            </a>
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
      <Notification />
    </AppBar>
  );
}
