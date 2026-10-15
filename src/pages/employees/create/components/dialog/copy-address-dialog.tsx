import type { Address } from '../../types';
import { useState, type ReactElement } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';

interface CopyAddressDialogProps {
  addresses: Address[];
  onSelect: (address: Address) => void;
}

export const CopyAddressDialog = ({
  addresses,
  onSelect,
}: CopyAddressDialogProps): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
        }}
      >
        <Button
          size="small"
          startIcon={<ContentCopyIcon />}
          disabled={addresses.length === 0}
          onClick={() => setOpen(true)}
        >
          Copy from employee&apos;s address
        </Button>
      </Stack>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Copy one of the employee&apos;s addresses</DialogTitle>
        <DialogContent dividers>
          <List disablePadding>
            {addresses.map((eca) => (
              <ListItemButton
                key={eca.formattedAddress}
                onClick={() => {
                  onSelect(eca);
                  setOpen(false);
                }}
              >
                <ListItemText primary={eca.formattedAddress} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
