import type {
  Department,
  DepartmentModel,
  DepartmentFormValues,
  DepartmentPayload,
  RawScope,
  RawDepartment,
  DepartmentNew,
} from '~/models/department.models';
import type { UserModel } from '~/models/user.models';
import type { RawOffice } from '~/models/location.models';
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
      primaryContactId: formValues.primaryContact?.id ?? '',
      secondaryContactId: formValues.secondaryContact?.id ?? '',
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
      new Set(rawMemberIds.filter((id): id is string => Boolean(id)))
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
  getAllDepartments: async (): Promise<Department[]> => {
    const [departmentsRes, usersRes, officesRes, scopesRes, positionsRes] =
      await Promise.all([
        mockClient.get<RawDepartment[]>('/departments'),
        mockClient.get<UserModel[]>('/users'),
        mockClient.get<RawOffice[]>('/offices'),
        mockClient.get<RawScope[]>('/scopes'),
        mockClient.get<RawPosition[]>('/positions'),
      ]);

    const rawDepartments = departmentsRes.data;
    const rawUsers = usersRes.data;
    const rawOffices = officesRes.data;
    const rawScopes = scopesRes.data;
    const rawPositions = positionsRes.data;

    // 1. Pre-index Positions into a Map for O(1) lookups
    const positionMap = new Map(
      rawPositions.map((pos) => [String(pos.id), pos.position])
    );

    // 2. Pre-index Users by ID for quick contact lookup
    const userMap = new Map(rawUsers.map((user) => [String(user.id), user]));

    // 3. Pre-index Offices by ID
    const officeMap = new Map(
      rawOffices.map((office) => [String(office.id), office])
    );

    // 4. Helper to format user objects consistently without repeating code
    const formatUser = (
      user?: UserModel
    ): {
      id: string;
      formattedName: string;
      position: string;
      avatarUrl: string;
      departmentId: string;
    } | null => {
      if (!user) return null;

      const positionName =
        positionMap.get(String(user.positionId)) ?? 'No Position';

      return {
        id: user.id,
        formattedName: `${user.firstname} ${user.lastname}`.trim(),
        position: positionName,
        avatarUrl: user.avatarUrl ?? null,
        departmentId: user.departmentId,
      };
    };

    return rawDepartments.map((dept) => {
      const deptIdStr = String(dept.id);
      const associatedMembers = rawUsers.filter((user) => {
        const userIdStr = String(user.id);
        const isMemberOfDepartment = String(user.departmentId) === deptIdStr;

        const isContact =
          userIdStr === String(dept.primaryContactId) ||
          userIdStr === String(dept.secondaryContactId);

        return isMemberOfDepartment && !isContact;
      });
      const asscociatedScopes = rawScopes.filter(
        (scope) => String(scope.departmentId) === deptIdStr
      );

      return {
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        description: dept.description,
        costCenterCode: dept.costCenterCode,
        coverImageUrl: dept.coverImageUrl ?? '',
        office: officeMap.get(String(dept.officeId)) ?? null,
        primaryContact: formatUser(userMap.get(String(dept.primaryContactId))),
        secondaryContact: formatUser(
          userMap.get(String(dept.secondaryContactId))
        ),
        status: dept.status ?? 'active',
        scopes: asscociatedScopes.map((scope) => ({
          title: scope.title,
          description: scope.description,
        })),
        teamMembers: associatedMembers
          .map((member) => formatUser(member))
          .filter((member) => member !== null),
      };
    });
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
