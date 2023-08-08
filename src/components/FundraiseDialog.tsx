import { VolunteerActivism } from "@suid/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
} from "@suid/material";
import { createSignal } from "solid-js";
import { fundraise } from "../services/contract-service";
import { refetchBalance as refetchAccountBalance } from "../store/account";
import { refetchBalance as refetchContractBalance } from "../store/contract";
import { setBlockLoading } from "../store/loading";
import { setAlertInfo } from "./utils/Notification";

export const [openFundraiseDialog, setOpenFundraiseDialog] =
  createSignal(false);

export default function FundraiseDialog() {
  const [amount, setAmount] = createSignal(1);

  const changeAmount = (value: number) => {
    if (value < 1) {
      setAmount(0);
      return;
    }
    setAmount(value);
  };

  const executeFundraise = async () => {
    try {
      setBlockLoading(true);
      const result = await fundraise(amount());
      setAlertInfo(() => ({
        severity: "success",
        content: (
          <>
            Fundraise successful at operation:&nbsp;
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
      refetchAccountBalance();
      refetchContractBalance();
    } catch (error) {
      setAlertInfo(() => ({
        severity: "error",
        content: (error as Error).toString(),
      }));
    } finally {
      setBlockLoading(false);
      setOpenFundraiseDialog(false);
    }
  };

  return (
    <Dialog
      open={openFundraiseDialog()}
      fullWidth
      maxWidth="xs"
      onClose={() => setOpenFundraiseDialog(false)}
    >
      <DialogTitle>Fundraise</DialogTitle>
      <DialogContent>
        <Box justifyContent="space-between" displayRaw="flex">
          <FormControl variant="standard" fullWidth>
            <InputLabel for="fundraise-value">Amount</InputLabel>
            <Input
              id="fundraise-value"
              endAdornment="ꜩ"
              type="number"
              value={amount() || ""}
              onChange={(_, value) => changeAmount(Number(value))}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          endIcon={<VolunteerActivism />}
          variant="outlined"
          onClick={executeFundraise}
          disabled={!amount()}
        >
          Fundraise
        </Button>
      </DialogActions>
    </Dialog>
  );
}
