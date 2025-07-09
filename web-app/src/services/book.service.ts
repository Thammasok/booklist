import { apiClient } from "@/lib/api-client";

export type BookLanguage = 'english' | 'thai' | 'other';
export type BookType = 'paper' | 'e-book' | 'both';

export interface CategoryReference {
  _id: string;
  name: string;
  slug: string;
}

export interface Book {
  _id: string;
  title: string;
  authors: string[];
  coverImage?: string;
  category: CategoryReference | string; // Can be either the full category object or just the ID
  tags: string[];
  language: BookLanguage;
  type: BookType;
  description?: string;
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
