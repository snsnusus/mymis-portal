// LEGACY - json-server shapes, kept only for:
//   - pages/departments/create-department/position.tsx (BasePosition,
//     PositionFormValues - old "position" field instead of "title")
//   - components/user-directory.tsx (RawPosition - chat directory, still on
//     mockClient pending the WebSocket/SignalR decision)
// Real API types live in position.model.ts. Remove once both are migrated.

export type BasePosition = {
  position: string;
  description: string;
  slug: string;
  isActive: boolean;
  isApprover: boolean;
};

export type PositionFormValues = BasePosition & {
  sortOrder: number;
};

export type RawPosition = BasePosition & {
  id: string;
  departmentId: string;
  sortOrder: number;
};
