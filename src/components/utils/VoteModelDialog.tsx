import { Block, Fingerprint, ThumbDown, ThumbUp } from "@suid/icons-material";
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@suid/material";
import Dialog, { DialogProps } from "@suid/material/Dialog";

import { refetchStorage } from "../../global/contract-storage";
import { VoteValue, vote } from "../../services/contract-service";
import { setBlockLoading } from "../TopBar";
import { setAlertInfo } from "./Notification";

export default function VoteModelDialog(
  props: { modelCid: string } & DialogProps,
) {
  const voteForModel = async (o: VoteValue) => {
    try {
      setBlockLoading(true);
      await vote(props.modelCid, o);
      await refetchStorage();
      setAlertInfo(() => ({
        severity: "success",
        content: "Voting successful",
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
    <Dialog {...props}>
      <DialogTitle>Vote Model</DialogTitle>
      <DialogContent>
        <Chip color="secondary" icon={<Fingerprint />} label={props.modelCid} />
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
