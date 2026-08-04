import { Injectable } from "@angular/core";

export interface ListUiState {
  search: string;
}

/**
 * Guarda en memoria la búsqueda de un listado para restaurarla cuando se
 * vuelve de crear/editar. Solo estado de UI, nunca datos de dominio — eso
 * vive en los `*Model` (ver ProductModel, UserModel).
 */
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
