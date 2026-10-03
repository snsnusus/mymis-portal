import { useState, type ReactElement } from 'react';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MuiTelInput, type MuiTelInputInfo } from 'mui-tel-input';
import Drawer from '~/components/ui/drawer';
import { DataDisplayRow } from '~/components/ui/data-display-row';
import { Switch } from '~/components/form/inputs/base/switch';
import OtpVerificationDialog from '../../pages/profile/tabs/contact/contact-number/otp-verification-dialog';

import { nodeClient } from '~/api/client';

export interface PhoneNumberDetails {
  // Database ID or reference link
  // id: string;
  // contactId: string; // Links to your main Contact/User record

  // Core Region Metadata
  countryCode: 'PH';
  dialCode: '+63';
  // Number Variations
  raw: string; // "9361231234" -> Cleanest form, great for indexing/queries
  international: string; // "+639361231234" -> The payload you pass to Semaphore/OTP APIs
  local: string; // "09361231234" -> Standard format for local lookups/logging
  formatted: string; // "(+63) 936 123 1234" -> Exactly what gets rendered in the UI

  // Verification State Guard
  isVerified: boolean;
  verifiedAt: Date | null; // Nullable until verified successfully
  isPrimary: boolean; // Indicates if this is the primary contact number

  // Timestamps
  // createdAt: Date;
  // updatedAt: Date;
}

interface AddContactNumberDrawerProps {
  withVerification?: boolean;
  onSave: (payload: PhoneNumberDetails) => void;
}

const AddContactNumberDrawer = ({
  withVerification = false,
  onSave,
}: AddContactNumberDrawerProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumberDetails, setPhoneNumberDetails] =
    useState<PhoneNumberDetails | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isOpenOtpDialog, setIsOpenOtpDialog] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [otpError, setOtpError] = useState<string>('');

  const handleChange = (input: string, info: MuiTelInputInfo): void => {
    setInputValue(input);
    // 1. Guard: If the info payload or national number is missing, emit null
    if (!info || !info.nationalNumber) {
      setPhoneNumberDetails(null);
      return;
    }

    const rawDigits = info.nationalNumber; // e.g., "9365449043"

    // 2. Guard: Ensure it's a valid complete 10-digit PH number starting with 9
    if (rawDigits.length !== 10 || !rawDigits.startsWith('9')) {
      setPhoneNumberDetails(null);
      return;
    }

    // 3. Slice up the national number for the display string: "(+63) 936 544 9043"
    const part1 = rawDigits.substring(0, 3);
    const part2 = rawDigits.substring(3, 6);
    const part3 = rawDigits.substring(6, 10);

    // 4. Construct the complete structured object matching your exact schema
    const numberDetails: PhoneNumberDetails = {
      countryCode: 'PH',
      dialCode: '+63',
      raw: rawDigits, // "9365449043"
      international: info.numberValue ?? `+63${rawDigits}`, // "+639365449043" (perfect for Semaphore OTP)
      local: `0${rawDigits}`, // "09365449043"
      formatted: `(+63) ${part1} ${part2} ${part3}`, // "(+63) 936 544 9043"
      isVerified: false,
      verifiedAt: null,
      isPrimary: false, // Default to false; can be toggled by the user
    };

    // 5. Emit the completed object up to the parent container
    setPhoneNumberDetails(numberDetails);
  };

  const toggleDrawer = (open: boolean) => () => setIsOpen(open);

  const handleVerify = async (): Promise<void> => {
    if (!phoneNumberDetails) return;

    setIsSendingOtp(true);

    try {
      const response = await nodeClient.post('/api/contacts/send-otp', {
        name: 'Test',
        email: 'test@test.com',
        phoneNumber: phoneNumberDetails.international,
      });

      if (response.data?.success) {
        setOtpExpiresAt(response.data.expiresAt);
        setIsOpenOtpDialog(true);
      } else {
        alert(response.data?.error || 'Failed to send verification code.');
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        const { error: errorMessage, expiresAt } = error.response.data;

        if (expiresAt) {
          setOtpExpiresAt(expiresAt);
          setIsOpenOtpDialog(true);
          setOtpError(errorMessage);
        } else {
          alert(error.response.data.error);
        }
      } else {
        const serverMessage = error.response?.data?.error;
        alert(serverMessage || 'Network connection error.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSave = (): void => {
    if (!phoneNumberDetails) return;
    onSave(phoneNumberDetails);
    toggleDrawer(false);
    setPhoneNumberDetails(null);
    setInputValue('');
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
        Add Contact Number
      </Button>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer(false)}
        title="Add Contact Number"
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
              disabled={!!withVerification || !phoneNumberDetails}
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        }
      >
        {isOpen && (
          <Stack
            sx={{
              gap: 2.5,
            }}
          >
            <DataDisplayRow
              label="Mobile Number"
              config={{
                labelBox: {
                  width: 120,
                },
              }}
            >
              <Stack spacing={1}>
                <MuiTelInput
                  value={inputValue}
                  onChange={handleChange}
                  defaultCountry="PH"
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
                      onClick={handleVerify}
                      disabled={!phoneNumberDetails}
                    >
                      {isSendingOtp ? 'Sending...' : 'Verify'}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </DataDisplayRow>
            <DataDisplayRow
              label="Set as primary number"
              config={{
                row: {
                  alignItems: 'center',
                },
                labelBox: {
                  width: 180,
                },
              }}
            >
              <Switch
                checked={phoneNumberDetails?.isPrimary ?? false}
                onChange={(e) =>
                  setPhoneNumberDetails((prev) =>
                    prev ? { ...prev, isPrimary: e.target.checked } : null
                  )
                }
              />
            </DataDisplayRow>
          </Stack>
        )}
      </Drawer>
      <OtpVerificationDialog
        open={isOpenOtpDialog}
        onClose={() => setIsOpenOtpDialog(false)}
        phoneNumber={phoneNumberDetails?.international ?? ''}
        expiresAt={otpExpiresAt}
        onVerifySuccess={() => console.log('verify')}
        externalError={otpError}
        setExternalError={setOtpError}
        onResend={handleVerify}
      />
    </>
  );
};

export default AddContactNumberDrawer;
