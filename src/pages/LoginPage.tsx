import {
  Alert,
  Avatar,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@suid/material";
import { Show, createSignal } from "solid-js";
import crepeLogo from "../assets/logo.svg";

import { setPrivateKey, signer } from "../global/account";

export default function LoginPage() {
  const [input, setInput] = createSignal<string>("");

  const login = () => {
    setPrivateKey(input());
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        pt: 20,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
        }}
      >
        <Stack spacing={4}>
          <Avatar
            src={crepeLogo}
            variant="rounded"
            sx={{
              width: 100,
              height: 100,
              m: "auto",
            }}
          />
          <Typography align="center" variant="h4">
            Crepe DAO Client
          </Typography>
          <TextField
            id="private-key"
            label="Private Key"
            variant="outlined"
            fullWidth={true}
            autoComplete="off"
            required
            value={input()}
            onChange={(_e, v) => setInput(v)}
          />
          <Button variant="contained" size="large" onClick={login}>
            Login
          </Button>
        </Stack>
      </Paper>
      <Show when={signer() instanceof Error}>
        <Alert severity="error" sx={{ mt: 6 }}>
          {(signer() as Error).toString()}
        </Alert>
      </Show>
    </Container>
  );
}
