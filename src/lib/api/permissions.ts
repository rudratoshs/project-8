import axios from 'axios';
import { Permission } from '../types/permission';

export const getPermissions = async (): Promise<Permission[]> => {
  const response = await axios.get('/permissions');
  return response.data;
};

export const getPermission = async (id: string): Promise<Permission> => {
  const response = await axios.get(`/permissions/${id}`);
  return response.data;
};