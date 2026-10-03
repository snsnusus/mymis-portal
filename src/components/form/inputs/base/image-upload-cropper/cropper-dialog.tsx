import { type ReactElement } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slider,
  Stack,
} from '@mui/material';
import Cropper, { type Point, type Area } from 'react-easy-crop';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

interface CropperDialogProps {
  open: boolean;
  crop: Point;
  zoom: number;
  imageSource: string | null;
  setCrop: (point: Point) => void;
  setZoom: (value: number) => void;
  onClose: () => void;
  onCrop: () => void;
  onCropcomplete: (areaPixels: Area) => void;
}

const CropperDialog = ({
  open,
  crop,
  zoom,
  imageSource,
  setCrop,
  setZoom,
  onClose,
  onCrop,
  onCropcomplete,
}: CropperDialogProps): ReactElement => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    disableRestoreFocus
  >
    <DialogContent sx={{ paddingBottom: 2, overflow: 'hidden' }} dividers>
      <Stack
        sx={{
          gap: 2,
        }}
      >
        <Stack sx={{ position: 'relative', width: '100%', height: '500px' }}>
          <Cropper
            image={imageSource ?? ''}
            crop={crop}
            zoom={zoom}
            aspect={3 / 3}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => onCropcomplete(areaPixels)}
          />
        </Stack>
        <Stack spacing={2.5} direction="row" sx={{ alignItems: 'center' }}>
          <ZoomOutIcon fontSize="medium" />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, value) => setZoom(value as number)}
          />
          <ZoomInIcon fontSize="medium" />
        </Stack>
      </Stack>
    </DialogContent>
    <DialogActions sx={{ padding: 2 }}>
      <Button variant="text" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="contained" onClick={onCrop}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

export default CropperDialog;
