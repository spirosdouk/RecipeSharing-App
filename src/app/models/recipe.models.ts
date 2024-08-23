export interface Recipe {
  id: number;
  title: string;
  image: string;
  sourceUrl: string;
  readyInMinutes: number;
  saved?: boolean;
}
