// src/services/workflowService.ts
import api from '@/lib/api';

export interface Workflow {
  id: number;
  url: string;
  blog: string;
  criteria: string;
  blogId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const workflowService = {
  async getWorkflows(): Promise<Workflow[]> {
    const response = await api.get('/api/v1/workflows');
    return response.data;
  },

  async getWorkflowById(id: number): Promise<Workflow> {
    const response = await api.get(`/api/v1/workflows/${id}`);
    return response.data;
  },

  async createWorkflow(data: Omit<Workflow, 'id'>): Promise<Workflow> {
    const response = await api.post('/api/v1/workflows', data);
    return response.data;
  },

  async updateWorkflow(id: number, data: Partial<Workflow>): Promise<Workflow> {
    const response = await api.put(`/api/v1/workflows/${id}`, data);
    return response.data;
  },

  async deleteWorkflow(id: number): Promise<void> {
    await api.delete(`/api/v1/workflows/${id}`);
  },
};