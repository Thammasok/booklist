"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookForm, type BookFormValues } from "./book-form";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { bookService, type Book } from "@/services/book.service";
import { toast } from "sonner";

interface AddBookDialogProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function AddBookDialog({ children, onOpenChange = () => {} }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BookFormValues) => {
      // Transform form data to match the Book type
      const bookData = {
        title: data.title,
        authors: data.authors,
        coverImage: data.coverImage || undefined,
        category: data.category, // This is the category ID
        tags: data.tags,
        language: data.language,
        type: data.type,
        description: data.description,
        isFavorite: data.isFavorite,
      } as const;
      return bookService.createBook(bookData);
    },
    onSuccess: () => {
      toast.success('Book added successfully');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setOpen(false);
      onOpenChange(false);
      router.refresh();
    },
    onError: (error: any) => {
      console.error('Error adding book:', error);
      toast.error(error.message || 'Failed to add book');
    },
  });

  const handleSubmit = (data: BookFormValues) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new book to your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <BookForm 
            onSubmit={handleSubmit} 
            isLoading={isPending} 
            submitButtonText="Add Book"
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
