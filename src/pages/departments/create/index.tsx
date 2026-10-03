import type { DepartmentFormValues } from '~/models/department.model';
import { type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
// import { useSnackbar } from 'notistack';
// import { useCreate } from '~/hooks/department.hook';
import { Box, Stack, Typography, Button } from '@mui/material';
import { FormProvider } from '~/components/form/form-provider';
import { LoadingOverlay } from '~/components/ui/loading-overlay';

import { Identity } from './identity';
import { Leadership } from './leadership';
import { Position } from './position';
import { ScopeAndTeam } from './scope-and-team';

const CreateDepartment = (): ReactElement => {
  const formState = useForm<DepartmentFormValues>({
    defaultValues: {
      name: '',
      slug: '',
      costCenterCode: '',
      office: null,
      description: '',
      primaryContact: null,
      secondaryContact: null,
      coverImage: null,
      scopes: [],
      teamMembers: [],
      positions: [],
    },
  });
  // const { mutateAsync: createDepartment, isPending } = useCreate();
  // const { enqueueSnackbar } = useSnackbar();

  // const handleSubmit = async (
  //   formValues: DepartmentFormValues
  // ): Promise<void> => {
  //   console.log(formValues, 'formValues');
  //   try {
  //     createDepartment(formValues, {
  //       onSuccess: async (res) => {
  //         console.log(res, 'res');
  //         formState.reset();
  //         enqueueSnackbar('Department created successfully!', {
  //           variant: 'success',
  //         });
  //       },
  //     });
  //   } catch (err) {
  //     console.error('Submission pipeline failed:', err);
  //   }
  // };

  return (
    <>
      <FormProvider {...formState} onSubmit={(data) => console.log(data)}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6">Create Department</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Establish a new business unit, assign leadership, and define its
              core charter.
            </Typography>
          </Box>
          <Identity />
          <Leadership />
          <Position />
          <ScopeAndTeam />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </FormProvider>
      <LoadingOverlay open={false} message="Creating department..." />
    </>
  );
};

export default CreateDepartment;
