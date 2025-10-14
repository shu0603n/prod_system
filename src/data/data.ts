export type PriceRange = {
  minQuantity: number;
  maxQuantity: number | null;
  price: number;
};

export type Product = {
  name: string;
  image: string;
  led: string;
  alcohol: string;
  volume: string;
  origin: string;
  varieties: { name: string; description: string }[];
  description?: string;
  priceRanges: PriceRange[];
};

export type Option = {
  id: number;
  image?: any;
  name: string;
  price: number;
};

export type Order = {
  product: Product | null;
  quantity: number | null;
  options: Option[];
};
