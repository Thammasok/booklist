"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookForm } from "./book-form";
import { bookService } from "@/services/book.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddBookDialogProps {
  children: React.ReactNode;
}

export function AddBookDialog({ children }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: bookService.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book created successfully");
      setOpen(false);
      router.refresh();
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
