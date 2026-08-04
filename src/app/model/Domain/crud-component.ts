/**
 * Contrato opcional que puede implementar un componente para engancharse a lo
 * que ocurre después de un guardado o un borrado. El componente se pasa a sí
 * mismo al service (`save(form, id, this)`) y el service llama al hook cuando
 * la operación termina bien.
 *
 * Sustituye a los callbacks `onSuccess` sueltos que había antes en cada
 * llamada: la orquestación vive en el service, el componente solo declara qué
 * quiere hacer al terminar.
 */
export interface CrudComponent {
  afterSave?(): void;
  afterDelete?(): void;
}
