export interface Barangay {
  id: number;
  name: string;
  psgcCode: string | null;
  zipCode: string | null;
  cityId: number;
}

export interface BarangayPayload {
  name: string;
  psgcCode: string | null;
  zipCode: string | null;
  cityId: number;
}
