"use client";

import { useParams, useRouter } from "next/navigation";
import { BookForm } from "@/components/books/book-form";
import { bookService } from "@/services/book.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.getBook(id as string),
    enabled: !!id,
  });

  const { mutate: updateBook, isPending } = useMutation({
    mutationFn: async (data: { title: string; author: string; description?: string; coverImage?: string; isFavorite: boolean }) => {
      return bookService.updateBook(id as string, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      toast.success("Book updated successfully");
      router.push(`/books/${id}`);
    },
    onError: (error) => {
      console.error("Error updating book:", error);
      toast.error("Failed to update book. Please try again.");
    },
  });

  const handleSubmit = (data: { title: string; author: string; description?: string; coverImage?: string; isFavorite: boolean }) => {
    updateBook(data);
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Book not found</h2>
        <p className="mb-6 text-muted-foreground">The book you're trying to edit doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/books')}>
          Back to Books
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Book</h1>
        <p className="text-muted-foreground">Update the details of your book.</p>
      </div>

      <div className="max-w-3xl rounded-lg border bg-card p-6 shadow-sm">
        <BookForm 
          defaultValues={book}
          onSubmit={handleSubmit} 
          isLoading={isPending} 
          submitButtonText="Save Changes"
        />
      </div>
    </div>
  );
}
