// File: src/components/ui/removable-item-list.tsx
import { type ReactElement, type ReactNode } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface RemovableItemListProps<T> {
  items: T[];
  /** Stable key per item, e.g. useFieldArray's generated `id`. */
  getKey: (item: T) => string;
  /** Small caption above the value, e.g. "Address 1". */
  getLabel: (item: T, index: number) => string;
  /** The main text, e.g. the formatted address. */
  getValue: (item: T) => ReactNode;
  icon: ReactNode;
  onRemove: (index: number) => void;
  /** Used for the tooltip and aria-label, e.g. "Remove address". */
  removeLabel: string;
  emptyText: string;
  maxHeight?: number;
}

export const RemovableItemList = <T,>({
  items,
  getKey,
  getLabel,
  getValue,
  icon,
  onRemove,
  removeLabel,
  emptyText,
  maxHeight = 200,
}: RemovableItemListProps<T>): ReactElement => {
  if (items.length === 0) {
    return <Typography color="text.secondary">{emptyText}</Typography>;
  }

  return (
    <Stack
      spacing={1}
      sx={{ overflowY: 'auto', maxHeight, scrollbarGutter: 'stable' }}
    >
      {items.map((item, index) => (
        <Paper
          key={getKey(item)}
          variant="outlined"
          sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}
        >
          {icon}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {getLabel(item, index)}
            </Typography>
            <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
              {getValue(item)}
            </Typography>
          </Box>
          <Tooltip title={removeLabel} placement="top-start" arrow>
            <IconButton
              aria-label={`${removeLabel} ${index + 1}`}
              sx={{ '&:hover': { color: 'error.main' } }}
              onClick={() => onRemove(index)}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Paper>
      ))}
    </Stack>
  );
};
