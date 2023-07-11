import { Close } from "@suid/icons-material";
import { Alert, IconButton } from "@suid/material";
import { AlertColor } from "@suid/material/Alert";
import { Show, createSignal } from "solid-js";

type AlertInfo = {
  severity: AlertColor;
  content: string;
};

export const [alertInfo, setAlertInfo] = createSignal<AlertInfo>();

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
    </Show>
  );
}
