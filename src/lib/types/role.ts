import { Permission } from './permission';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: {
    permission: Permission;
  }[];
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleData extends Partial<CreateRoleData> {}