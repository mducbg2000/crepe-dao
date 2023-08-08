import { Block, Fingerprint, ThumbDown, ThumbUp } from "@suid/icons-material";
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@suid/material";
import Dialog from "@suid/material/Dialog";
import { createSignal } from "solid-js";
import { VoteValue, vote } from "../services/contract-service";
import { refetchStorage } from "../store/contract";
import { setBlockLoading } from "../store/loading";
import { setAlertInfo } from "./utils/Notification";

export const [voteCID, setVoteCID] = createSignal<string>();

export default function VoteModelDialog() {
  const voteForModel = async (o: VoteValue) => {
    try {
      setBlockLoading(true);
      const result = await vote(voteCID()!, o);
      await refetchStorage();
      setVoteCID();
      setAlertInfo(() => ({
        severity: "success",
        content: (
          <>
            Vote model successful at operation:&nbsp;
            <a
              href={`https://ghostnet.tzkt.io/${result}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result}
            </a>
          </>
        ),
      }));
    } catch (err) {
      setAlertInfo(() => ({
        severity: "error",
        content: (err as Error).toString(),
      }));
    } finally {
      setBlockLoading(false);
    }
  };
  return (
    <Dialog open={voteCID() !== undefined} onClose={setVoteCID}>
      <DialogTitle>Vote Model</DialogTitle>
      <DialogContent>
        <Chip color="secondary" icon={<Fingerprint />} label={voteCID()} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="success"
          endIcon={<ThumbUp />}
          onClick={() => voteForModel("accept")}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          color="error"
          endIcon={<ThumbDown />}
          onClick={() => voteForModel("reject")}
        >
          Reject
        </Button>
        <Button
          variant="outlined"
          color="info"
          endIcon={<Block />}
          onClick={() => voteForModel("abstain")}
        >
          Abstain
        </Button>
      </DialogActions>
    </Dialog>
  );
}
