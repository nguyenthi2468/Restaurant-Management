import { GalleryImages } from "../gallery";
import { MenuItem } from "../menu-items";


export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  imageId: string | null;
  image: GalleryImages | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  menuItems: MenuItem[];
}

// DTOs for API requests
export interface CreateMenuCategoryDto {
  name: string;
  description?: string;
  imageId?: string;
  position?: number;
  isActive?: boolean;
}

export interface UpdateMenuCategoryDto {
  name?: string;
  description?: string;
  imageId?: string;
  position?: number;
  isActive?: boolean;
}
