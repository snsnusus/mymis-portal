import {
  styled,
  Card,
  Stepper as MuiStepper,
  StepConnector as MuiStepConnector,
  StepLabel as MuiStepLabel,
  stepConnectorClasses,
  Box,
} from '@mui/material';

export const Stepper = styled(MuiStepper)(({ theme }) => ({
  width: '100%',
  flexShrink: 0,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 50,
  padding: theme.spacing(1.5, 1.5, 1, 1.5),
  '& .MuiStep-root': {
    flex: 1,
  },
  '& .MuiStepLabel-label': {
    whiteSpace: 'normal',
    textAlign: 'center',
    minWidth: 0,
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: theme.palette.primary.main,
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.success.main,
  },
}));

export const StepConnector = styled(MuiStepConnector)(({ theme }) => ({
  flexShrink: 0,
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderStyle: 'none',
      height: 2,
      display: 'block',
      background: `linear-gradient(
        to right,
        ${theme.palette.success.main} 0%,
        ${theme.palette.success.main} 50%,
        ${theme.palette.primary.main} 50%,
        ${theme.palette.primary.main} 100%
      )`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 2,
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

export const StepLabel = styled(MuiStepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontSize: theme.typography.body1.fontSize,
    letterSpacing: 0.5,
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
    '&.MuiStepLabel-alternativeLabel': {
      marginTop: theme.spacing(1),
    },
  },
}));

export const SpeechCardContainer = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  border: '2px solid',
  borderColor: theme.palette.text.muted,
  borderRadius: 25,
  position: 'relative',
  overflow: 'visible',
  backgroundColor: theme.palette.common.white,
  maxWidth: 320,
}));

export const SpeechCardArrow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '-10px',
  top: '50%',
  transform: 'translateY(-50%) rotate(45deg)',
  width: theme.spacing(2),
  height: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  borderLeft: '2px solid',
  borderLeftColor: theme.palette.text.muted,
  borderBottom: '2px solid',
  borderBottomColor: theme.palette.text.muted,
  zIndex: 1,
}));
