export interface ProductResponse {
  id: number;
  name: string;
  barcode: string;
  price: number;
  category: string;
}

export interface ProductRequest {
  name: string;
  barcode?: string;
  price: number;
  category?: string;
}
