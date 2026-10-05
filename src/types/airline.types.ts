
export interface AirlineEntity {
id: number; 
  iataCode?: string;
  prefixCode?: string | null;
  name?: string | null;
  country?: string | null;
}