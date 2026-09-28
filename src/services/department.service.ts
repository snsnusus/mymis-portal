import type {
  DepartmentModel,
  DepartmentFormValues,
  DepartmentPayload,
  DepartmentNew,
} from '~/models/department.models';
import type { RawPosition } from '~/models/position.models';

import { apiClient, mockClient } from '~/api/client';
import { uploadImageToCloud } from '~/utils';

export const departmentService = {
  getDepartments: async (): Promise<DepartmentNew[]> => {
    const res = await apiClient.get('/Departments');
    return res.data;
  },
  createDepartment: async (formValues: DepartmentFormValues) => {
    const cloudImageUrl = await uploadImageToCloud(formValues.coverImage);

    const payload: DepartmentPayload = {
      name: formValues.name,
      slug: formValues.slug,
      description: formValues.description,
      costCenterCode: formValues.costCenterCode,
      coverImageUrl: cloudImageUrl,
      primaryContactId: formValues.primaryContact
        ? String(formValues.primaryContact.id)
        : null,
      secondaryContactId: formValues.secondaryContact
        ? String(formValues.secondaryContact.id)
        : null,
      officeId: formValues.office?.id ?? '',
      status: 'active',
    };

    const { data: department } = await mockClient.post<DepartmentModel>(
      '/departments',
      payload
    );
    const departmentId = department.id;

    const rawMemberIds = [
      formValues.primaryContact?.id,
      formValues.secondaryContact?.id,
      ...(formValues.teamMembers?.map((m) => m.id) ?? []),
    ];
    const uniqueMemberIds = Array.from(
      new Set(rawMemberIds.filter((id): id is number => id !== undefined))
    );

    const userPatchPromises = uniqueMemberIds.map((userId) =>
      mockClient.patch(`/users/${userId}`, { departmentId })
    );

    const scopePostPromises = (formValues.scopes ?? []).map(
      ({ title, description }) =>
        mockClient.post('/scopes', {
          departmentId: departmentId,
          title,
          description,
        })
    );

    const positionPostPromises = (formValues.positions ?? []).map(
      ({ position, slug, description, sortOrder, isActive, isApprover }) =>
        mockClient.post('/positions', {
          position,
          slug,
          description,
          sortOrder,
          isActive,
          isApprover,
          departmentId: departmentId,
        })
    );

    await Promise.all([
      ...userPatchPromises,
      ...scopePostPromises,
      ...positionPostPromises,
    ]);

    return departmentId;
  },

  getPositionsByDepartment: async (
    departmentId: string
  ): Promise<RawPosition[]> => {
    const { data: positions } = await mockClient.get<RawPosition[]>(
      '/positions'
    );

    return positions
      .filter((position) => position.departmentId === departmentId)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },
};
