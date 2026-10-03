// File: src/pages/data-management/hmo/create-provider/plan-card.tsx
import { type ReactElement } from 'react';
import { get, useFormState, useWatch } from 'react-hook-form';
import {
  Box,
  ButtonBase,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { type HmoPlanFormValues } from '~/schema/hmo.schema';
import { countFieldErrors } from '~/utils/form.util';
import { formatCurrency } from '~/utils/number.util';

import { CoverageEditor } from './coverage-editor';
import { PlanDependents } from './plan-dependents';
import { PlanDetails } from './plan-details';
import { PlanPec } from './plan-pec';
import { PlanPricing } from './plan-pricing';
import {
  PLAN_TIER_LABELS,
  PREMIUM_FREQUENCY_SUFFIX,
  ROOM_TYPE_LABELS,
} from '../constants';

interface PlanCardProps {
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

const buildSummary = (plan: HmoPlanFormValues): string => {
  const parts: string[] = [];
  if (plan.tier) {
    parts.push(PLAN_TIER_LABELS[plan.tier]);
  }
  if (plan.roomType) {
    parts.push(ROOM_TYPE_LABELS[plan.roomType]);
  }
  if (plan.maximumBenefitLimit !== null) {
    parts.push(`MBL ${formatCurrency(plan.maximumBenefitLimit, 0)}`);
  }
  if (plan.premiumCost !== null && plan.premiumFrequency) {
    parts.push(
      `${formatCurrency(plan.premiumCost, 0)}${
        PREMIUM_FREQUENCY_SUFFIX[plan.premiumFrequency]
      }`
    );
  }
  const itemCount = plan.coverageGroups.reduce(
    (total, group) => total + group.items.length,
    0
  );
  parts.push(`${itemCount} coverage ${itemCount === 1 ? 'item' : 'items'}`);

  return parts.join(' · ');
};

export const PlanCard = ({
  index,
  expanded,
  onToggle,
  onRemove,
}: PlanCardProps): ReactElement => {
  const namePrefix = `plans.${index}`;
  const bodyId = `plan-card-body-${index}`;

  const plan = useWatch({ name: namePrefix }) as HmoPlanFormValues;
  const { errors } = useFormState({ name: namePrefix });
  const errorCount = countFieldErrors(get(errors, namePrefix));
  const hasErrors = errorCount > 0;

  const title = plan.name.trim() || `New plan ${index + 1}`;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: hasErrors
          ? 'error.main'
          : expanded
          ? 'primary.main'
          : 'divider',
        borderRadius: 1,
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', pr: 1 }}>
        <ButtonBase
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={bodyId}
          sx={{
            flex: 1,
            justifyContent: 'flex-start',
            textAlign: 'left',
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: 1,
          }}
        >
          {expanded ? (
            <ExpandMoreIcon color="action" />
          ) : (
            <ChevronRightIcon color="action" />
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body1"
              color={hasErrors ? 'error' : 'text.secondary'}
              sx={{ fontWeight: 'fontWeightMedium' }}
            >
              {title}
            </Typography>
            {!expanded && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {buildSummary(plan)}
              </Typography>
            )}
          </Box>
          {hasErrors && (
            <Chip
              size="small"
              color="error"
              variant="outlined"
              label={`${errorCount} ${errorCount === 1 ? 'error' : 'errors'}`}
              sx={{ ml: 'auto' }}
            />
          )}
        </ButtonBase>
        <IconButton aria-label={`Remove ${title}`} onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </Stack>

      <Collapse in={expanded}>
        <Box id={bodyId}>
          <Divider />
          <Stack spacing={2.5} sx={{ p: 2 }}>
            <PlanDetails namePrefix={namePrefix} />
            <Divider />
            <PlanPricing namePrefix={namePrefix} />
            <Divider />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <PlanPec namePrefix={namePrefix} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <PlanDependents namePrefix={namePrefix} />
              </Grid>
            </Grid>
            <Divider />
            <CoverageEditor namePrefix={namePrefix} />
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};
