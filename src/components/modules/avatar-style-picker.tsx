import type { MouseEvent, ReactElement } from 'react';
import type { AvatarStyle } from '~/models/employee.model';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  AVATAR_STYLES,
  DEFAULT_AVATAR_STYLE,
  getDefaultAvatarUri,
} from '~/utils/default-avatar';

const STYLE_LABELS: Record<AvatarStyle, string> = {
  avataaars: 'Avatars',
  bottts: 'Bots',
  constellation: 'Constellation',
};

type AvatarStylePickerProps = {
  value: AvatarStyle | null | undefined; // null = not chosen, shows the default
  onChange: (style: AvatarStyle) => void; // only called with a different style
  seed: string | number; // whose avatar the previews show
  disabled?: boolean;
  previewSize?: number; // px
};

// Shows one preview tile per style and reports which one is clicked.
// Knows nothing about the API: the parent decides what a change means
// (save immediately on Profile, store in the form on Create).
export const AvatarStylePicker = ({
  value,
  onChange,
  seed,
  disabled = false,
  previewSize = 72,
}: AvatarStylePickerProps): ReactElement => {
  const selectedStyle = value ?? DEFAULT_AVATAR_STYLE;

  const handleChange = (
    _event: MouseEvent<HTMLElement>,
    newStyle: AvatarStyle | null
  ): void => {
    // Clicking the selected tile gives null; clicking it again isn't a change.
    if (newStyle && newStyle !== selectedStyle) {
      onChange(newStyle);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={selectedStyle}
      onChange={handleChange}
      disabled={disabled}
      aria-label="Avatar style"
    >
      {AVATAR_STYLES.map((style) => (
        <ToggleButton
          key={style}
          value={style}
          sx={{ flexDirection: 'column', gap: 1, px: 3, py: 1.5 }}
        >
          <Box
            component="img"
            src={getDefaultAvatarUri(style, seed)}
            alt=""
            sx={{
              width: previewSize,
              height: previewSize,
              borderRadius: '50%',
              bgcolor: 'action.hover',
            }}
          />
          <Typography variant="body2" sx={{ textTransform: 'none' }}>
            {STYLE_LABELS[style]}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
