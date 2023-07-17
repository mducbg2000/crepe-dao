import { CheckCircle, ContentCopy } from "@suid/icons-material";
import { IconButton } from "@suid/material";
import { Show, createSignal } from "solid-js";

export default function CopyBtn(props: { value: string | undefined }) {
  const [copied, setCopied] = createSignal(false);

  const copy = async () => {
    await navigator.clipboard.writeText(props.value ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <IconButton onClick={copy}>
      <Show when={copied()} fallback={<ContentCopy fontSize="small" />}>
        <CheckCircle color="success" fontSize="small" />
      </Show>
    </IconButton>
  );
}
