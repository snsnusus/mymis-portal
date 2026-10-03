// File: src/hooks/use-numeric-text-input.ts
import { useMemo, useState, type ChangeEvent, type FocusEvent } from 'react';

type InputElement = HTMLInputElement | HTMLTextAreaElement;

interface UseNumericTextInputOptions {
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Digits allowed after the decimal point. 0 = whole numbers only. */
  decimals: number;
  /** Text shown while not editing. Defaults to String(value). */
  toDisplayText?: (value: number) => string;
  /** Text placed in the box when editing starts. Defaults to String(value). */
  toEditText?: (value: number) => string;
  /** Converts the typed number into the stored value. Defaults to no change. */
  fromTypedNumber?: (typed: number) => number;
  onFocus?: (event: FocusEvent<InputElement>) => void;
  onBlur?: (event: FocusEvent<InputElement>) => void;
}

interface UseNumericTextInputResult {
  displayValue: string;
  handleFocus: (event: FocusEvent<InputElement>) => void;
  handleBlur: (event: FocusEvent<InputElement>) => void;
  handleChange: (event: ChangeEvent<InputElement>) => void;
}

const buildAllowedPattern = (decimals: number): RegExp =>
  decimals > 0 ? new RegExp(`^\\d*(\\.\\d{0,${decimals}})?$`) : /^\d*$/;

export const useNumericTextInput = ({
  value,
  onValueChange,
  decimals,
  toDisplayText = String,
  toEditText = String,
  fromTypedNumber = (typed) => typed,
  onFocus,
  onBlur,
}: UseNumericTextInputOptions): UseNumericTextInputResult => {
  const [isFocused, setIsFocused] = useState(false);
  const [rawText, setRawText] = useState('');
  const allowedPattern = useMemo(
    () => buildAllowedPattern(decimals),
    [decimals]
  );

  let displayValue = rawText;
  if (!isFocused) {
    displayValue = value === null ? '' : toDisplayText(value);
  }

  const handleFocus = (event: FocusEvent<InputElement>): void => {
    setRawText(value === null ? '' : toEditText(value));
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<InputElement>): void => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<InputElement>): void => {
    const text = event.target.value.replace(/,/g, '');
    if (!allowedPattern.test(text)) {
      return;
    }
    setRawText(text);
    onValueChange(
      text === '' || text === '.' ? null : fromTypedNumber(Number(text))
    );
  };

  return { displayValue, handleFocus, handleBlur, handleChange };
};
