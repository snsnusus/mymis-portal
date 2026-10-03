import { type ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, LinearProgress } from '@mui/material';

import Tab from '~/components/tab';
import { useGetById as useGetDepartmentById } from '~/queries/department.query';
import { isNotFoundError } from '~/utils/http.util';

import { DepartmentHero } from './department-hero';

import { OverviewTab } from '~/pages/departments/detail/tabs/overview';
import { PersonnelTab } from '~/pages/departments/detail/tabs/personnel';
import { OrgChartTab } from '~/pages/departments/detail/tabs/org-chart';

const Department = (): ReactElement => {
  const { id } = useParams<{ name: string; id: string }>();
  const departmentId = Number(id);
  const isValidId = Number.isInteger(departmentId) && departmentId > 0;

  const {
    data: department,
    isLoading,
    isError,
    error,
  } = useGetDepartmentById(isValidId ? departmentId : undefined);

  if (!isValidId || isNotFoundError(error)) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Department not found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          It may have been removed, or the link is incorrect.
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return <LinearProgress sx={{ mt: 2 }} />;
  }

  if (isError || !department) {
    return (
      <Typography color="error" sx={{ py: 4 }}>
        Couldn&apos;t load this department. Please try refreshing.
      </Typography>
    );
  }

  return (
    <>
      <DepartmentHero {...department} />
      <Tab
        tabs={[
          {
            label: 'Overview',
            content: <OverviewTab department={department} />,
          },
          {
            label: 'Personnel & Staffing',
            content: <PersonnelTab departmentId={department.id} />,
          },
          {
            label: 'Org Chart',
            content: <OrgChartTab />,
          },
        ]}
      />
    </>
  );
};

export default Department;
