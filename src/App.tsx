import { CssBaseline } from "@suid/material";
import { InMemorySigner } from "@taquito/signer";
import { Show } from "solid-js";
import { signer } from "./global/account";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import "./services/download-weights-service";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Show when={signer() instanceof InMemorySigner} fallback={<LoginPage />}>
        <Dashboard />
      </Show>
    </>
  );
}
