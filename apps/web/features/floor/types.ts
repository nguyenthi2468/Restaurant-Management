export interface Floor {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tables: number;
  };
}

export interface CreateFloorDto {
  name: string;
}

export interface UpdateFloorDto {
  name?: string;
}
