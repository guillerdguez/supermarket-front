export interface BranchResponse {
  id: number;
  name: string;
  address?: string;
  isWarehouse?: boolean;
}
export interface BranchRequest {
  name: string;
  address: string;
  isWarehouse?: boolean;
}
