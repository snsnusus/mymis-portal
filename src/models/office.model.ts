export interface Office {
  id: number;
  name: string;
  city: string;
  countryCode: string;
  address: string | null;
}

export interface OfficePayload {
  name: string;
  city: string;
  countryCode: string;
  address: string | null;
}
