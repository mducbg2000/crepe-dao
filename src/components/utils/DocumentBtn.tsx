import { Help } from "@suid/icons-material";
import { IconButton } from "@suid/material";
import OnHoverPopover from "./OnHoverPopover";

export default function DocumentBtn() {
  return (
    <IconButton
      color="info"
      onClick={() =>
        window.open(`https://github.com/mducbg2000/crepe-dao#readme`)
      }
    >
      <OnHoverPopover
        content="Click to read app's document"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Help />
      </OnHoverPopover>
    </IconButton>
  );
}
