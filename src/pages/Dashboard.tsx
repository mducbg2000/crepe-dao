import {
  Alert,
  Box,
  Container,
  CssBaseline,
  List,
  Skeleton,
  Stack,
  Toolbar,
} from "@suid/material";
import { For, Show } from "solid-js";
import LeftBar from "../components/LeftBar";
import ModelPoll from "../components/ModelPoll";
import TopBar from "../components/TopBar";
import VoteModelDialog from "../components/VoteModelDialog";
import { storage } from "../store/contract";
import { getModelsInCurrentRound } from "../utils/extract-models-utils";

export default function Dashboard() {
  return (
    <Container disableGutters maxWidth={false} sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar />
      <LeftBar />
      <Box component="main" p={3} flexGrow={1} height="100vh" overflow="scroll">
        <Toolbar />
        <Show
          when={storage() != null}
          fallback={<Skeleton variant="rectangular" height="85vh" />}
        >
          <List>
            <Stack spacing={3}>
              <For each={getModelsInCurrentRound(storage()!)}>
                {(item) => <ModelPoll model={item} />}
              </For>
              <Show when={getModelsInCurrentRound(storage()!).length === 0}>
                <Alert severity="info">
                  There are no updates for this round yet
                </Alert>
              </Show>
            </Stack>
          </List>
        </Show>
      </Box>
      <VoteModelDialog />
    </Container>
  );
}
