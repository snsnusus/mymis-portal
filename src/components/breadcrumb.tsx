import { type ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, styled, Typography } from '@mui/material';
import { useBreadcrumbs } from '~/hooks/use-breadcrumbs';

const Link = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const AppBreadcrumbs = (): ReactElement => {
  const crumbs = useBreadcrumbs();

  return (
    <Breadcrumbs>
      {crumbs.map(({ id, label, path }) =>
        path ? (
          <Link key={id} to={path} color="inherit">
            {label}
          </Link>
        ) : (
          <Typography key={id} color="text.primary">
            {label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
};
