import { apiClient } from "@/lib/api-client";

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const bookService = {
  getBooks: async (): Promise<Book[]> => {
    const response = await apiClient.get('/books');
    return response.data.data;
  },

  getBook: async (id: string): Promise<Book> => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data.data;
  },

  createBook: async (data: Omit<Book, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiClient.post('/books', data);
    return response.data.data;
  },

  updateBook: async (id: string, data: Partial<Book>) => {
    const response = await apiClient.patch(`/books/${id}`, data);
    return response.data.data;
  },

  deleteBook: async (id: string) => {
    await apiClient.delete(`/books/${id}`);
  },

  toggleFavorite: async (id: string, isFavorite: boolean) => {
    const response = await apiClient.patch(`/books/${id}/favorite`, { isFavorite });
    return response.data.data;
  }
};
