import { apiClient } from "@/lib/api-client";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (data: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiClient.post('/categories', data);
    return response.data.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await apiClient.patch(`/categories/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id: string) => {
    await apiClient.delete(`/categories/${id}`);
  },

  // Get categories as options for select inputs
  getCategoryOptions: async (): Promise<{ value: string; label: string }[]> => {
    const categories = await categoryService.getCategories();
    return categories.map(category => ({
      value: category.slug,
      label: category.name
    }));
  }
};
