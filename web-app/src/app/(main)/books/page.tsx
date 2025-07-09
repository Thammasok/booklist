"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/books/book-card";
import { bookService, type Book } from "@/services/book.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { AddBookDialog } from "@/components/books/add-book-dialog";

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["books", { favoritesOnly }],
    queryFn: () => bookService.getBooks(),
  });

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !favoritesOnly || book.isFavorite;
    return matchesSearch && matchesFavorites;
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Book List</h1>
        <AddBookDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </AddBookDialog>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>
        <Button
          variant={favoritesOnly ? "default" : "outline"}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className="w-full sm:w-auto"
        >
          {favoritesOnly ? "Show All" : "Favorites Only"}
        </Button>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-medium">No books found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {searchTerm || favoritesOnly
              ? "Try adjusting your search or filter"
              : "Get started by adding a new book"}
          </p>
          <AddBookDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </AddBookDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
