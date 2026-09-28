export interface Region {
  id: number;
  name: string;
  psgcCode: string | null;
}

export interface RegionPayload {
  name: string;
  psgcCode: string | null;
}
