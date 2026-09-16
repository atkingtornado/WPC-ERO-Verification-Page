import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

/**
 * A Tooltip wrapper that opens on tap for touch devices and on hover for desktop.
 * All MUI Tooltip props are forwarded as-is.
 */
export const TouchTooltip = ({ children, ...props }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);
  const touch = isTouchDevice();

  const child = children as React.ReactElement<{ onClick?: () => void }>;
  const childHasClick = !!child.props.onClick;

  // For desktop, or for button-like children (which have their own onClick), use
  // default MUI behavior (hover on desktop, press-and-hold on touch).
  if (!touch || childHasClick) {
    return <Tooltip {...props}>{children}</Tooltip>;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        {...props}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        onClose={() => setOpen(false)}
      >
        {React.cloneElement(child, {
          onClick: () => {
            setOpen((prev) => !prev);
          },
        })}
      </Tooltip>
    </ClickAwayListener>
  );
};
