import { useState, type ReactElement } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import {
  Alert,
  type AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import type { BulkInsertResult } from '~/models/bulk.model';
import { parseBulkJson } from '~/utils/parse-bulk-json';

interface BulkUploadDialogProps {
  open: boolean;
  title: string; // e.g. "Bulk upload regions"
  instructions: string; // what each row needs
  example: string; // shown as the textarea placeholder
  context?: string; // e.g. "Uploading to Metro Manila (NCR)"
  mutation: UseMutationResult<BulkInsertResult, Error, unknown[]>;
  onClose: () => void;
}

const getSeverity = (result: BulkInsertResult): AlertColor => {
  if (result.inserted === result.total) {
    return 'success';
  }
  if (result.inserted === 0) {
    return 'error';
  }
  return 'warning';
};

const BulkUploadDialog = ({
  open,
  title,
  instructions,
  example,
  context,
  mutation,
  onClose,
}: BulkUploadDialogProps): ReactElement => {
  const [text, setText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const result = mutation.data;
  const isUploading = mutation.isLoading;

  const handleUpload = (): void => {
    const parsed = parseBulkJson(text);
    if (!parsed.ok) {
      setParseError(parsed.error);
      return;
    }
    setParseError(null);
    mutation.mutate(parsed.rows);
  };

  // Back to the text area, keeping the text so skipped rows can be fixed.
  // Re-uploading is safe: rows that were inserted come back as duplicates.
  const handleEditAgain = (): void => {
    mutation.reset();
  };

  const handleClose = (): void => {
    setText('');
    setParseError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={isUploading ? undefined : handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{title}</DialogTitle>
      {result ? (
        <>
          <DialogContent dividers>
            <Stack sx={{ gap: 2 }}>
              <Alert severity={getSeverity(result)}>{result.message}</Alert>
              {result.errors.length > 0 && (
                <>
                  <Typography variant="subtitle2">
                    Skipped rows ({result.failed})
                  </Typography>
                  <TableContainer sx={{ maxHeight: 320 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell width={64}>Row</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell>Data</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.errors.map((rowError) => (
                          <TableRow key={rowError.row}>
                            <TableCell>{rowError.row}</TableCell>
                            <TableCell>{rowError.errors.join(' ')}</TableCell>
                            <TableCell
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: 12,
                                wordBreak: 'break-all',
                              }}
                            >
                              {JSON.stringify(rowError.data)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button color="inherit" onClick={handleEditAgain}>
              Edit and re-upload
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Done
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent dividers>
            <Stack sx={{ gap: 2, pt: 1 }}>
              {context && <Alert severity="info">{context}</Alert>}
              <Typography variant="body2" color="text.secondary">
                {instructions}
              </Typography>
              {mutation.error && (
                <Alert severity="error">{mutation.error.message}</Alert>
              )}
              <TextField
                label="JSON rows"
                multiline
                minRows={10}
                maxRows={20}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setParseError(null); // clear the error as soon as they edit
                }}
                placeholder={example}
                error={!!parseError}
                helperText={
                  parseError ??
                  'Paste a JSON array. Invalid rows are skipped and listed after upload.'
                }
                disabled={isUploading}
                slotProps={{
                  input: { sx: { fontFamily: 'monospace', fontSize: 13 } },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              color="inherit"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default BulkUploadDialog;
