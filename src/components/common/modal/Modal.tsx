import { Box } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

interface SimpleDialogProps extends DialogProps {
  header?: React.ReactNode;
  mainContents?: React.ReactNode;
  width: string;
  footer?: React.ReactNode;
}

// Create the dialog you want to use
export const Modal: React.FC<SimpleDialogProps> = ({
  header,
  mainContents,
  footer,
  width,
  ...props
}) => (
  <Dialog
    {...props}
    PaperProps={{
      sx: {
        width: width, // 전달된 너비 적용
        maxWidth: "none", // 최대 너비 제한 해제
      },
    }}
  >
    {header && <DialogTitle>{header}</DialogTitle>}
    <Box p={2}>{mainContents}</Box>
    {footer && <Box p={2}>{footer}</Box>}
  </Dialog>
);
