"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string().min(1, "Author name cannot be empty")).min(1, "At least one author is required"),
  coverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string().min(1, "Tag cannot be empty")),
  language: z.enum(['english', 'thai', 'other']),
  type: z.enum(['paper', 'e-book', 'both']),
  description: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (data: BookFormValues) => void;
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
  const [tagInput, setTagInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  
  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema) as any,
    defaultValues: {
      title: "",
      authors: [],
      coverImage: "",
      category: 'self-improve',
      tags: [],
      language: 'english',
      type: 'paper',
      description: "",
      isFavorite: false,
      ...(defaultValues ? {
        ...defaultValues,
        authors: defaultValues.authors || [],
        tags: defaultValues.tags || [],
      } : {}),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }} className="space-y-6">
        <div className="space-y-6">
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
            name="authors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authors</FormLabel>
                <div className="flex gap-2 mb-2">
                  <Input 
                    placeholder="Add author" 
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && authorInput.trim()) {
                        e.preventDefault();
                        const currentAuthors = form.getValues('authors') || [];
                        if (!currentAuthors.includes(authorInput.trim())) {
                          field.onChange([...currentAuthors, authorInput.trim()]);
                        }
                        setAuthorInput('');
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (authorInput.trim()) {
                        const currentAuthors = form.getValues('authors') || [];
                        if (!currentAuthors.includes(authorInput.trim())) {
                          field.onChange([...currentAuthors, authorInput.trim()]);
                        }
                        setAuthorInput('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((author: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {author}
                      <button
                        type="button"
                        onClick={() => {
                          const newAuthors = field.value.filter((_: any, i: number) => i !== index);
                          field.onChange(newAuthors);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {isLoadingCategories ? (
                          <span>Loading categories...</span>
                        ) : (
                          <SelectValue placeholder="Select a category" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="thai">Thai</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paper">Paper Book</SelectItem>
                      <SelectItem value="e-book">E-book</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
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
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2 mb-2">
                  <Input 
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault();
                        const currentTags = form.getValues('tags') || [];
                        if (!currentTags.includes(tagInput.trim().toLowerCase())) {
                          field.onChange([...currentTags, tagInput.trim().toLowerCase()]);
                        }
                        setTagInput('');
                      }
                    }}
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (tagInput.trim()) {
                        const currentTags = form.getValues('tags') || [];
                        if (!currentTags.includes(tagInput.trim().toLowerCase())) {
                          field.onChange([...currentTags, tagInput.trim().toLowerCase()]);
                        }
                        setTagInput('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = field.value.filter((_: any, i: number) => i !== index);
                          field.onChange(newTags);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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

        <div className="flex justify-end gap-2">
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
