export type Price = {
  id: string;
  unit_amount: number;
  currency: string;
  lookup_key: string;
  product: string;
};
export type Products = { id: string; name: string; description: number };

export type PriceCalculation = {
  currency: string;
  estimate: boolean;
  lookup_key: string;
  price_id: string;
  tax_amount: number;
  total_unit_amount: number;
  total_without_tax: number;
};
