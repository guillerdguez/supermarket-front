import { Injectable } from "@angular/core";

export interface ListUiState {
  search: string;
}


@Injectable({ providedIn: "root" })
export class ListUiStateService {
  private readonly state = new Map<string, ListUiState>();

  get(key: string): ListUiState | undefined {
    return this.state.get(key);
  }

  set(key: string, value: ListUiState): void {
    this.state.set(key, value);
  }
}
