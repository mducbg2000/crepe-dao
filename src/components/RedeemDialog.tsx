import { Redeem } from "@suid/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  Stack,
  Typography,
} from "@suid/material";
import { createSignal } from "solid-js";
import { withdraw } from "../services/contract-service";
import { refetchBalance as refetchAccountBalance } from "../store/account";
import {
  refetchBalance as refetchContractBalance,
  refetchStorage,
} from "../store/contract";
import { setBlockLoading } from "../store/loading";
import { setAlertInfo } from "./utils/Notification";

export const [openRedeemDialog, setOpenRedeemDialog] = createSignal(false);

export default function RedeemDialog() {
  const [amount, setAmount] = createSignal(1);

  const changeAmount = (value: number) => {
    if (value < 1) {
      setAmount(0);
      return;
    }
    setAmount(value);
  };

  const redeem = async () => {
    try {
      setBlockLoading(true);
      const result = await withdraw(amount());
      setAlertInfo(() => ({
        severity: "success",
        content: (
          <>
            Earn ꜩ successful at operation:&nbsp;
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
      refetchStorage();
    } catch (error) {
      setAlertInfo(() => ({
        severity: "error",
        content: (error as Error).toString(),
      }));
    } finally {
      setBlockLoading(false);
      setOpenRedeemDialog(false);
    }
  };

  return (
    <Dialog
      open={openRedeemDialog()}
      fullWidth
      maxWidth="xs"
      onClose={() => setOpenRedeemDialog(false)}
    >
      <DialogTitle>Earn Reward</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box justifyContent="space-between" displayRaw="flex">
            <FormControl variant="standard" fullWidth>
              <InputLabel for="fundraise-value">Amount</InputLabel>
              <Input
                id="fundraise-value"
                endAdornment="point"
                type="number"
                value={amount() || ""}
                onChange={(_, value) => changeAmount(Number(value))}
              />
            </FormControl>
          </Box>
          <Box justifyContent="space-between" displayRaw="flex">
            <Typography variant="overline">Value: </Typography>
            <Chip label={amount() * 0.25 + " ꜩ"} />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          endIcon={<Redeem />}
          variant="outlined"
          onClick={redeem}
          disabled={!amount()}
        >
          Earn
        </Button>
      </DialogActions>
    </Dialog>
  );
}
