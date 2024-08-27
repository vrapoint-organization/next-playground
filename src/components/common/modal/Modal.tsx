import Dialog, { DialogProps } from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogActions, DialogContentText } from "@mui/material";
import React from "react";

interface SimpleDialogProps extends DialogProps {
  header?: React.ReactNode;
  mainContents?: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
  onClose?: () => void;
}

// Create the dialog you want to use
export const Modal: React.FC<SimpleDialogProps> = ({
  header,
  mainContents,
  footer,
  width,
  onClose,
  ...props
}) => (
  <Dialog
    {...props}
    PaperProps={{
      sx: {
        width: width,
      },
    }}
  >
    {header && (
      <DialogTitle>
        {React.isValidElement(header)
          ? React.cloneElement(header, { onClose })
          : header}
      </DialogTitle>
    )}
    <DialogContent sx={{ padding: "0px 20px" }}>
      <DialogContentText>{mainContents}</DialogContentText>
    </DialogContent>
    <DialogActions>
      {footer && (
        <Box p={2}>
          {React.isValidElement(footer)
            ? React.cloneElement(footer, { onClose })
            : footer}
        </Box>
      )}
    </DialogActions>
  </Dialog>
);
