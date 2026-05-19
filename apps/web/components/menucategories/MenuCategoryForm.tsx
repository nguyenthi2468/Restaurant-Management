'use client';
import React, { useState } from 'react';
import GalleryImageDialog from '@/components/common/GalleryImageDialog';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import { Loader2, ImageIcon, FileText, Settings } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  menuCategorySchema,
  MenuCategoryFormValues,
} from '@/features/menu-categories';

interface MenuCategoryFormProps {
  menuCategory?: MenuCategoryFormValues;
  initialImageUrl?: string;
  onSubmit: (
    data: MenuCategoryFormValues,
  ) => Promise<void>;
  isSubmitting: boolean;
}

function MenuCategoryForm({
  menuCategory,
  initialImageUrl,
  onSubmit,
  isSubmitting,
}: MenuCategoryFormProps) {
  const form = useForm<MenuCategoryFormValues>({
    resolver: zodResolver(menuCategorySchema),
    defaultValues: {
      name: menuCategory?.name || '',
      description: menuCategory?.description || '',
      imageId: menuCategory?.imageId || '',
      position: menuCategory?.position || 0,
      isActive: menuCategory?.isActive ?? true,
    },
  });

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column - General Info */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-muted/20 p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-foreground font-semibold text-lg border-b pb-4">
              <FileText className="w-5 h-5 text-primary" />
              General Information
            </div>
            
            <div className="space-y-6">
              {/* Name */}
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="mb-2 inline-block font-medium">Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Enter menu category name"
                      className="bg-background shadow-sm"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="mb-2 inline-block font-medium">Description</FieldLabel>
                    <Input 
                      {...field} 
                      placeholder="Enter description" 
                      className="bg-background shadow-sm"
                    />
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block font-medium">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Image Section */}
          <div className="bg-muted/20 p-6 rounded-xl border shadow-sm space-y-4">
             <div className="flex items-center gap-2 text-foreground font-semibold text-lg border-b pb-4 mb-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Category Image
             </div>
             <Controller
                control={form.control}
                name="imageId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-col gap-4">
                      <div className="h-48 w-full relative border-2 border-dashed rounded-lg overflow-hidden bg-background flex flex-col items-center justify-center group transition-colors hover:border-primary/50">
                        {imageUrl ? (
                          <>
                              <Image
                                src={imageUrl}
                                alt="Selected category image"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsGalleryOpen(true)}
                                    className="font-medium shadow-md"
                                  >
                                    Change Image
                                  </Button>
                              </div>
                          </>
                        ) : (
                          <div className="text-center p-4 flex flex-col items-center text-muted-foreground cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                              <div className="bg-muted p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-medium">No image selected</span>
                              <span className="text-xs text-muted-foreground/70 mt-1">Click to browse gallery</span>
                          </div>
                        )}
                      </div>
                      
                      {imageUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full font-medium"
                            onClick={() => {
                              form.setValue('imageId', '');
                              setImageUrl(null);
                            }}
                          >
                            Remove Image
                          </Button>
                      )}
                      
                      {fieldState.invalid && (
                        <span className="text-xs text-destructive block text-center font-medium">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </div>
                    
                    <GalleryImageDialog
                      open={isGalleryOpen}
                      onOpenChange={setIsGalleryOpen}
                      initialSelected={
                        field.value ? {id: field.value, url: imageUrl || ''} : null
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
          </div>

          {/* Settings Section */}
          <div className="bg-muted/20 p-6 rounded-xl border shadow-sm space-y-4">
             <div className="flex items-center gap-2 text-foreground font-semibold text-lg border-b pb-4 mb-2">
                <Settings className="w-5 h-5 text-primary" />
                Configuration
             </div>
             
             {/* Position */}
             <Controller
                control={form.control}
                name="position"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="mb-2 inline-block font-medium">Display Position</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      placeholder="e.g. 1"
                      className="bg-background shadow-sm"
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? undefined : Number(val));
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-2">Lower numbers appear first in the menu list.</p>
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block font-medium">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              {/* Is Active */}
              <Controller
                control={form.control}
                name="isActive"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="pt-4">
                    <div className="flex items-center justify-between bg-background p-4 rounded-lg border shadow-sm">
                        <div className="space-y-1">
                            <FieldLabel className="text-sm font-medium">Active Status</FieldLabel>
                            <p className="text-xs text-muted-foreground">Make category visible.</p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                    </div>
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-2 block font-medium">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />
          </div>

        </div>
      </div>

      <div className="flex items-center justify-end pt-6 border-t gap-3 mt-8">
        <Button 
           type="button" 
           variant="outline"
           onClick={() => window.history.back()}
           disabled={isSubmitting}
           className="min-w-[100px]"
        >
           Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px] shadow-sm">
          {isSubmitting ? (
             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
             <>{menuCategory ? 'Save Changes' : 'Create Category'}</>
          )}
        </Button>
      </div>
    </form>
  );
}

export default MenuCategoryForm;
