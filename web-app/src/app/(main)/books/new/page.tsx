"use client";

import { useRouter } from "next/navigation";
import { BookForm } from "@/components/books/book-form";
import { bookService } from "@/services/book.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function NewBookPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: bookService.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book created successfully");
      router.push("/books");
    },
    onError: (error) => {
      console.error("Error creating book:", error);
      toast.error("Failed to create book. Please try again.");
    },
  });

  const handleSubmit = (data: { 
    title: string; 
    author: string; 
    description?: string; 
    coverImage?: string; 
    isFavorite: boolean 
  }) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-8">
      <div className="w-full max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Add New Book</h1>
          <p className="text-muted-foreground">Fill in the details below to add a new book to your collection.</p>
        </div>

        <div className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-6 shadow-sm">
          <BookForm 
            onSubmit={handleSubmit} 
            isLoading={isPending} 
            submitButtonText="Add Book" 
          />
        </div>
      </div>
    </div>
  );
}
