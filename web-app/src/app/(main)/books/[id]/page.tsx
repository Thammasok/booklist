"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Heart, Loader2, Pencil, Trash2 } from "lucide-react";
import { bookService, type Book } from "@/services/book.service";
import Image from "next/image";

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: book, isLoading, isError } = useQuery<Book>({
    queryKey: ["book", id],
    queryFn: () => bookService.getBook(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="container py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Book not found</h2>
        <p className="mb-6 text-muted-foreground">The book you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/books')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 md:grid-cols-[300px,1fr]">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={book.coverImage || "/images/book-placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover"
            priority
          />
          <button 
            className="absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-destructive/20"
            onClick={() => {
              // Handle favorite toggle
            }}
          >
            <Heart 
              className={`h-5 w-5 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
              strokeWidth={2} 
            />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
              <p className="mt-1 text-lg text-muted-foreground">{book.author}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <a href={`/books/${book._id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </a>
              </Button>
              <Button variant="outline" size="icon" className="text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Added on {new Date(book.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {book.description && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-muted-foreground">{book.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
