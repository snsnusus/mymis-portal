import type { ReactElement } from 'react';
import TextField, {
  type TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';

export type BaseTextFieldProps = MuiTextFieldProps & {
  name: string;
};

export const BaseTextField = (props: BaseTextFieldProps): ReactElement => (
  <TextField
    variant="outlined"
    size={props.size ?? 'small'}
    fullWidth={props.fullWidth ?? true}
    {...props}
    slotProps={{
      ...props.slotProps,
      inputLabel: {
        ...props.slotProps?.inputLabel,
      },
    }}
  />
);
