
export interface CrudComponent {
  afterSave?(): void;
  afterDelete?(): void;
}
