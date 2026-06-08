import apiClient from './apiClient';
import type {
  CustomerEquipmentResponse,
  CreateCustomerEquipmentRequest,
  UpdateCustomerEquipmentRequest,
} from '../types/equipment';

export const EquipmentService = {
  async getMyEquipment(): Promise<CustomerEquipmentResponse[]> {
    return apiClient.get('/api/customers/me/equipment');
  },

  async getEquipmentById(equipmentId: number): Promise<CustomerEquipmentResponse> {
    return apiClient.get(`/api/customers/me/equipment/${equipmentId}`);
  },

  async createEquipment(
    data: CreateCustomerEquipmentRequest,
  ): Promise<CustomerEquipmentResponse> {
    return apiClient.post('/api/customers/me/equipment', data);
  },

  async updateEquipment(
    equipmentId: number,
    data: UpdateCustomerEquipmentRequest,
  ): Promise<CustomerEquipmentResponse> {
    return apiClient.put(`/api/customers/me/equipment/${equipmentId}`, data);
  },

  async deleteEquipment(equipmentId: number): Promise<void> {
    await apiClient.delete(`/api/customers/me/equipment/${equipmentId}`);
  },
};
