import { useState, type ReactElement } from 'react';

import { Button, Stack, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Drawer from '~/components/ui/drawer';
import { DataDisplayRow } from '~/components/ui/data-display-row';
import { Switch } from '~/components/form/inputs/base/switch';

interface AddEmailDrawerProps {
  withVerification?: boolean;
  onSave: ({
    email,
    tag,
    isPrimary,
  }: {
    email: string;
    tag: string;
    isPrimary: boolean;
    isVerified: boolean;
    verifiedAt: Date | null;
  }) => void;
}

const AddEmailDrawer = ({
  onSave,
  withVerification = false,
}: AddEmailDrawerProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [tag, setTag] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const toggleDrawer = (open: boolean) => () => setIsOpen(open);

  const handleSave = (): void => {
    onSave({
      email,
      tag,
      isPrimary,
      isVerified: false,
      verifiedAt: null,
    });
    setIsOpen(false);
    setEmail('');
    setTag('');
    setIsPrimary(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={toggleDrawer(true)}
        startIcon={<AddIcon />}
      >
        Add Email
      </Button>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer(false)}
        title="Add Email"
        action={
          <>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={toggleDrawer(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={!!withVerification}
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        }
      >
        <Stack spacing={2}>
          <DataDisplayRow label="Email *">
            <Stack spacing={1}>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
              />
              {withVerification && (
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    variant="text"
                    onClick={() => {}}
                    disabled={!!withVerification}
                  >
                    Verify
                  </Button>
                </Stack>
              )}
            </Stack>
          </DataDisplayRow>
          <DataDisplayRow label="Tag">
            <Stack spacing={1}>
              <TextField
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Stack>
          </DataDisplayRow>
          <DataDisplayRow
            label="Set as primary number"
            config={{
              row: {
                alignItems: 'center',
              },
              labelBox: {
                width: 160,
              },
            }}
          >
            <Switch
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
            />
          </DataDisplayRow>
        </Stack>
      </Drawer>
    </>
  );
};

export default AddEmailDrawer;
