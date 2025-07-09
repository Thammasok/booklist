import { Book } from "@/services/book.service";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={book.coverImage || "/images/book-placeholder.jpg"}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button 
          className="absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-destructive/20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle favorite toggle
          }}
        >
          <Heart 
            className={`h-5 w-5 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            strokeWidth={2} 
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        {book.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {book.description}
          </p>
        )}
      </div>
      <Link href={`/books/${book._id}`} className="absolute inset-0" />
    </div>
  );
}
