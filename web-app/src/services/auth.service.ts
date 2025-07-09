import { apiClient } from "@/lib/api-client"

export interface User {
    _id: string
    username: string
    email: string
    role: string
    isVerified: boolean
    isDeleted: boolean
    deletedAt: string
    createdAt: string
    updatedAt: string
  }
  
export const authApi = {
    register: async (data: { username: string; email: string; password: string }) => {
        const response = await apiClient.post('/users/register', data);
        return response.data;
    },

    login: async (data: { email: string; password: string }) => {
        const response = await apiClient.post('/users/login', data);
        return response.data;
    },

    getMe: async () => {
        const response = await apiClient.get('/users/me');
        return response.data.data;
    },

    logout: async () => {
        const response = await apiClient.post('/users/logout');
        return response.data;
    },  
};
