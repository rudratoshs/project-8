import axios from 'axios';
import { Role, CreateRoleData, UpdateRoleData } from '../types/role';

export const getRoles = async (): Promise<Role[]> => {
  const response = await axios.get('/roles');
  return response.data;
};

export const getRole = async (id: string): Promise<Role> => {
  const response = await axios.get(`/roles/${id}`);
  return response.data;
};

export const createRole = async (data: CreateRoleData): Promise<Role> => {
  const response = await axios.post('/roles', data);
  return response.data;
};

export const updateRole = async (id: string, data: UpdateRoleData): Promise<Role> => {
  const response = await axios.put(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await axios.delete(`/roles/${id}`);
};