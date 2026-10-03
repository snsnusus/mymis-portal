import type { ReactElement } from 'react';
import { useState } from 'react';

import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { getMonth, getYears, getYear } from './utils';

const StyledYearsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, auto)',
  gap: 1,
  width: 'auto',
  overflow: 'auto',
  maxHeight: theme.spacing(12.5),
  padding: theme.spacing(0, 1),
  backgroundColor: theme.palette.background.default,
}));

const StyledYearButton = styled(IconButton)(({ theme }) => ({
  fontWeight: 'fontWeightBold',
  borderRadius: '50%',
  padding: theme.spacing(1),
  fontFamily: 'Google Sans',
  fontSize: 'medium',
}));

type HeaderProps = ReactDatePickerCustomHeaderProps;

const DatePickerHeader = (props: HeaderProps): ReactElement => {
  const {
    date,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    changeYear,
    increaseMonth,
    decreaseMonth,
  } = props;
  const [isYearsOptionsVisible, setIsYearsOptionsVisible] = useState(false);

  const toggleYearsOptions = (): void => {
    setIsYearsOptionsVisible((prevState) => !prevState);
  };

  const selectYear = (year: number): void => {
    changeYear(year);
    setIsYearsOptionsVisible(false);
  };

  return (
    <Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          px: 2,
          py: 0,
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            color="independence"
            sx={{
              fontWeight: 'fontWeightBold',
            }}
          >
            {getMonth(date)}
          </Typography>
          <IconButton disableRipple onClick={toggleYearsOptions}>
            <Typography sx={{ fontWeight: 'fontWeightBold' }}>
              {getYear(date)}
            </Typography>
            {isYearsOptionsVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
        <Stack direction="row">
          <IconButton
            disabled={prevMonthButtonDisabled}
            onClick={decreaseMonth}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            disabled={nextMonthButtonDisabled}
            onClick={increaseMonth}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Stack>

      {isYearsOptionsVisible ? (
        <StyledYearsContainer>
          {getYears().map((year) => (
            <StyledYearButton
              key={year}
              color={year === getYear(date) ? 'primary' : undefined}
              onClick={() => selectYear(year)}
            >
              {year}
            </StyledYearButton>
          ))}
        </StyledYearsContainer>
      ) : null}
    </Stack>
  );
};

export default DatePickerHeader;
