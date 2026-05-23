export interface Floor {
  id: string;
  name: string;
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
