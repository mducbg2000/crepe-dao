import { Box, Popover, Typography } from "@suid/material";
import { PopoverProps } from "@suid/material/Popover";
import { createSignal, type ParentProps } from "solid-js";

export default function OnHoverPopover(
  props: ParentProps & { content: string } & Partial<PopoverProps>,
) {
  const [anchorEl, setAnchorEl] = createSignal<Element | null>(null);
  const handlePopoverOpen = (event: { currentTarget: Element }) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = () => Boolean(anchorEl());
  return (
    <>
      <Box
        aria-owns={open() ? "mouse-over-popover" : ""}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {props.children}
      </Box>
      <Popover
        id="on-hover-popover"
        sx={{ pointerEvents: "none", zIndex: 2000 }}
        open={open()}
        anchorEl={anchorEl()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        {...props}
      >
        <Typography sx={{ p: 1 }}>{props.content}</Typography>
      </Popover>
    </>
  );
}
