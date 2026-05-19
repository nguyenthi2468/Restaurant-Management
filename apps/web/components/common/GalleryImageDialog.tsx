'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GalleryFolders from './GalleryFolders';
import GalleryImages from './GalleryImages';
import api from '@/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, Loader2, ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/constants';

interface SelectedImage {
  id?: string;
  url: string;
}

interface GalleryImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSelected?: SelectedImage | null;
  onConfirm: (image: SelectedImage | null) => void;
}

export default function GalleryImageDialog({
  open,
  onOpenChange,
  initialSelected = null,
  onConfirm,
}: GalleryImageDialogProps) {
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string;
    folderName: string;
  } | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedImage(initialSelected);
  }, [initialSelected, open]);

  const selectedIds = new Set(
    selectedImage?.id 
        ? [selectedImage.id] 
        : (selectedImage?.url ? [selectedImage.url] : [])
  );

  const handleToggle = (img: { id: string; url: string }) => {
    setSelectedImage((prev) => {
      if (prev?.id === img.id) {
        return null;
      }
      return img;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!selectedFolder?.folderName || !files || files.length === 0) return;
    
    setUploading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('files', f));
      await api.post(`${API_BASE_URL}/upload/image/${selectedFolder.folderName}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['images-gallery', selectedFolder.id] });
      queryClient.invalidateQueries({ queryKey: ['folders-gallery'] }); // Counts might change
    } catch (error) {
        console.error("Upload failed", error);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFolderSelect = (folder: { id: string; folderName: string }) => {
      setSelectedFolder(folder);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="min-w-[80vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="w-5 h-5" />
            Select Image
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar: Folders */}
          <aside className="w-64 border-r bg-muted/30 flex flex-col shrink-0">
            <GalleryFolders
              selectedFolderId={selectedFolder?.id ?? null}
              onSelect={handleFolderSelect}
            />
          </aside>

          {/* Main Content: Images */}
          <main className="flex-1 flex flex-col bg-background min-w-0">
            {/* Toolbar */}
             <div className="border-b p-3 flex justify-between items-center bg-card shadow-sm z-10">
                <div className="text-sm font-medium text-muted-foreground pl-2">
                    {selectedFolder ? (
                        <span>Folder: <span className="text-foreground font-semibold">{selectedFolder.folderName}</span></span>
                    ) : (
                        <span>Select a folder to manage images</span>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    <Input
                        type="file"
                        multiple
                        accept="image/*"
                         className="hidden"
                         ref={fileInputRef}
                         onChange={handleUpload}
                         disabled={!selectedFolder || uploading}
                    />
                    <Button
                        size="sm"
                        disabled={!selectedFolder || uploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                         {uploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Upload className="mr-2 h-4 w-4" />
                         )}
                         {uploading ? 'Uploading...' : 'Upload Images'}
                    </Button>
                </div>
             </div>
             
             {/* Images Grid */}
             <div className="flex-1 overflow-hidden relative">
                <GalleryImages
                    folderId={selectedFolder?.id ?? null}
                    selectedIds={selectedIds}
                    onToggle={handleToggle}
                />
             </div>
          </main>
        </div>

        <DialogFooter className="px-6 py-3 border-t shrink-0 bg-muted/10">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
                {selectedImage ? '1 image selected' : 'No image selected'}
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        const imageToConfirm = selectedImage 
                            ? {
                                id: selectedImage.id?.startsWith('http') ? undefined : selectedImage.id,
                                url: selectedImage.url,
                            }
                            : null;
                        onConfirm(imageToConfirm);
                    }}
                >
                    Confirm Selection
                </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
