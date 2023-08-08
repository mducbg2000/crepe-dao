import { Close } from "@suid/icons-material";
import { Alert, IconButton, LinearProgress } from "@suid/material";
import { AlertColor } from "@suid/material/Alert";
import { JSXElement, Show, createEffect, createSignal } from "solid-js";

type AlertInfo = {
  severity: AlertColor;
  content: JSXElement;
};

export const [alertInfo, setAlertInfo] = createSignal<AlertInfo>();

const [progress, setProgress] = createSignal(100);

createEffect(() => {
  if (alertInfo() !== undefined) {
    setProgress(100);
    const timer = setInterval(() => {
      setProgress((now) => now - 1);
    }, 40);
    setTimeout(() => {
      setAlertInfo();
      clearInterval(timer);
    }, 4000);
  }
});

export default function Notification() {
  return (
    <Show when={alertInfo() !== undefined}>
      <Alert
        severity={alertInfo()!.severity}
        elevation={24}
        action={
          <IconButton size="small" onClick={() => setAlertInfo()}>
            <Close />
          </IconButton>
        }
      >
        {alertInfo()?.content}
      </Alert>
      <LinearProgress variant="determinate" value={progress()} color="info" />
    </Show>
  );
}
