import type { Position } from '~/models/position.model';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { positionService } from '~/services/position.service';

export const positionKeys = {
  all: ['positions'] as const,
  byDepartment: (departmentId: number | undefined) =>
    [...positionKeys.all, 'department', departmentId] as const,
};

export const useGetAll = (
  departmentId: number | undefined
): UseQueryResult<Position[]> =>
  useQuery({
    queryKey: positionKeys.byDepartment(departmentId),
    queryFn: () => positionService.getAll(departmentId),
    enabled: departmentId !== undefined,
  });
