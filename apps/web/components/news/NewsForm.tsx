'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import EditorClient from '@/components/common/EditorClient';
import GalleryImageDialog from '@/components/common/GalleryImageDialog';

import { newsFormSchema, NewsFormValues } from '../../features/news/validator';
import { NewsStatus } from '../../features/news/types';

interface NewsFormProps {
  initialData?: NewsFormValues;
  initialImageUrl?: string;
  onSubmit: (data: NewsFormValues) => void;
  isLoading?: boolean;
}

export function NewsForm({
  initialData,
  initialImageUrl,
  onSubmit,
  isLoading,
}: NewsFormProps) {
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: initialData || {
      title: '',
      summary: '',
      content: '',
      status: NewsStatus.DRAFT,
      imageId: '',
    },
  });

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialImageUrl || null,
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <p className="text-sm text-muted-foreground">
            Enter the main details for your news article
          </p>
        </div>

        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="Enter a compelling title"
                  disabled={isLoading}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="h-11"
                />
                {fieldState.invalid && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldState.error?.message}
                  </span>
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="summary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="summary">Summary</FieldLabel>
                <Textarea
                  id="summary"
                  placeholder="Write a brief summary that captures the essence of your article"
                  className="resize-none min-h-[100px]"
                  disabled={isLoading}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldState.error?.message}
                  </span>
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="status">Publication Status</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger id="status" className="h-11">
                    <SelectValue placeholder="Select publication status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NewsStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={NewsStatus.PUBLISHED}>
                      Published
                    </SelectItem>
                    <SelectItem value={NewsStatus.ARCHIVED}>
                      Archived
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldState.error?.message}
                  </span>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Content</h3>
          <p className="text-sm text-muted-foreground">
            Write the full content of your news article
          </p>
        </div>

        <FieldGroup>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <EditorClient
                  content={field.value || ''}
                  onChange={field.onChange}
                />
                {fieldState.invalid && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldState.error?.message}
                  </span>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Featured Image</h3>
          <p className="text-sm text-muted-foreground">
            Choose an eye-catching image for your article
          </p>
        </div>

        <FieldGroup>
          <Controller
            name="imageId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex flex-col gap-4">
                  <div className="w-full max-w-2xl mx-auto">
                    <div className="aspect-video relative border-2 border-dashed rounded-xl overflow-hidden bg-muted/30 flex flex-col items-center justify-center group transition-all hover:border-primary/50 hover:bg-muted/50">
                      {imageUrl ? (
                        <>
                          <Image
                            src={imageUrl}
                            alt="News image"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
                            <Button
                              type="button"
                              variant="secondary"
                              size="lg"
                              disabled={isLoading}
                              onClick={() => setIsGalleryOpen(true)}
                              className="shadow-lg"
                            >
                              Change Image
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div
                          className="text-center p-8 flex flex-col items-center text-muted-foreground cursor-pointer w-full h-full justify-center"
                          onClick={() => setIsGalleryOpen(true)}
                        >
                          <div className="bg-background border-2 border-dashed border-muted-foreground/20 p-6 rounded-full mb-4 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-200">
                            <ImageIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-base font-medium mb-1">
                            No image selected
                          </span>
                          <span className="text-sm text-muted-foreground/70">
                            Click to select an image from gallery
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {imageUrl && (
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          form.setValue('imageId', '');
                          setImageUrl(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                  {fieldState.invalid && (
                    <span className="text-xs text-destructive block text-center">
                      {fieldState.error?.message}
                    </span>
                  )}
                </div>
                <GalleryImageDialog
                  open={isGalleryOpen}
                  onOpenChange={setIsGalleryOpen}
                  initialSelected={
                    field.value
                      ? { id: field.value, url: imageUrl || '' }
                      : null
                  }
                  onConfirm={(image) => {
                    if (image) {
                      form.setValue('imageId', image.id || '');
                      setImageUrl(image.url);
                    } else {
                      form.setValue('imageId', '');
                      setImageUrl(null);
                    }
                    setIsGalleryOpen(false);
                  }}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="min-w-[140px]"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save News
        </Button>
      </div>
    </form>
  );
}
