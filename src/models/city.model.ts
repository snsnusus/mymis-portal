export interface City {
  id: number;
  name: string;
  psgcCode: string | null;
  regionId: number;
}

export interface CityPayload {
  name: string;
  psgcCode: string | null;
  regionId: number;
}
