import { Injectable, inject } from "@angular/core";
import { forkJoin } from "rxjs";
import { ProductDao } from "../../DAO/product/product.dao";
import { ProductResponse, ProductRequest } from "../../DTO/product.dto";
import { ProductModel } from "../../model/Domain/product.model";
import { CrudComponent } from "../../model/Domain/crud-component";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class ProductService {
  private readonly dao = inject(ProductDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(ProductModel);

  retrieveList(search?: string): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    this.dao.getAll(search).subscribe({
      next: (page) => this.afterRetrieveList(page?.content ?? []),
      error: (err) => {
        this.model.error.set(
          this.messages.resolveErrorDetail("errorGettingProducts", err),
        );
        this.model.list.set([]);
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingProducts", err);
      },
    });
  }

  private afterRetrieveList(list: ProductResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }

  retrieveDetail(id: number): void {
    this.model.editing.set(null);

    this.dao.getById(id).subscribe({
      next: (product) => this.model.editing.set(product),
      error: (err) => this.messages.publishErrorMsg("errorGettingProduct", err),
    });
  }

  save(body: ProductRequest, id?: number, component?: CrudComponent): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    if (id != null) {
      this.dao.update(id, body).subscribe({
        next: (updated) => this.afterSave(updated, true, component),
        error: (err) => this.onSaveError("errorUpdatingProduct", err),
      });
    } else {
      this.dao.create(body).subscribe({
        next: (created) => this.afterSave(created, false, component),
        error: (err) => this.onSaveError("errorCreatingProduct", err),
      });
    }
  }

  private afterSave(
    saved: ProductResponse,
    isUpdate: boolean,
    component?: CrudComponent,
  ): void {
    this.model.loading.set(false);
    this.model.list.update((list) =>
      list.some((p) => p.id === saved.id)
        ? list.map((p) => (p.id === saved.id ? saved : p))
        : [...list, saved],
    );
    this.messages.publishSuccessMsg(
      isUpdate ? "productUpdated" : "productCreated",
    );
    component?.afterSave?.();
  }

  private onSaveError(
    key: "errorCreatingProduct" | "errorUpdatingProduct",
    err: unknown,
  ): void {
    this.model.loading.set(false);
    this.model.error.set(this.messages.resolveErrorDetail(key, err));
    this.messages.publishErrorMsg(key, err);
  }

  
  delete(ids: number | number[], component?: CrudComponent): void {
    const idList = Array.isArray(ids) ? ids : [ids];
    const snapshot = this.model.list();

    this.model.list.set(snapshot.filter((p) => !idList.includes(p.id)));

    forkJoin(idList.map((id) => this.dao.delete(id))).subscribe({
      next: () => {
        this.messages.publishSuccessMsg("productDeleted");
        component?.afterDelete?.();
      },
      error: (err) => {
        this.model.list.set(snapshot);
        this.messages.publishErrorMsg("errorDeletingProduct", err);
      },
    });
  }
}
