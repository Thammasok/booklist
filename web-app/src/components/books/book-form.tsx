"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Book } from "@/services/book.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { SubmitHandler } from 'react-hook-form';

const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  coverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  isFavorite: z.boolean().default(false),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  defaultValues?: Partial<Book>;
  onSubmit: SubmitHandler<BookFormValues>;
  isLoading?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function BookForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitButtonText = "Save Book",
  onCancel,
}: BookFormProps) {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema) as any, // Type assertion to handle the resolver type
    defaultValues: {
      title: "",
      author: "",
      description: "",
      coverImage: "",
      isFavorite: false,
      ...(defaultValues ? Object.fromEntries(
        Object.entries(defaultValues).filter(([_, v]) => v !== undefined && v !== null)
      ) : {}),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/cover.jpg" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFavorite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Favorite</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Add this book to your favorites
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about this book..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => window.history.back())}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
