import { Injectable, inject } from "@angular/core";
import { ProfileDao } from "../../DAO/profile/profile.dao";
import { UserResponse } from "../../DTO/auth.dto";
import { ProfileUpdateRequest, ChangePasswordRequest } from "../../DTO/profile.dto";
import { ProfileModel } from "../../model/Domain/profile.model";
import { CrudComponent } from "../../model/Domain/crud-component";
import { AuthService } from "../auth/auth.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class ProfileService {
  private readonly dao = inject(ProfileDao);
  private readonly messages = inject(MessageProcessingService);
  private readonly auth = inject(AuthService);
  readonly model = inject(ProfileModel);

  retrieveDetail(): void {
    this.model.loading.set(true);

    this.dao.get().subscribe({
      next: (profile) => this.afterRetrieveDetail(profile),
      error: (err) => {
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingProfile", err);
      },
    });
  }

  private afterRetrieveDetail(profile: UserResponse): void {
    this.model.profile.set(profile);
    this.auth.setCurrentUser(profile);
    this.model.loading.set(false);
  }

  save(body: ProfileUpdateRequest, component?: CrudComponent): void {
    this.model.loading.set(true);

    this.dao.update(body).subscribe({
      next: (profile) => {
        this.afterRetrieveDetail(profile);
        this.messages.publishSuccessMsg("profileUpdated");
        component?.afterSave?.();
      },
      error: (err) => {
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorUpdatingProfile", err);
      },
    });
  }

  changePassword(body: ChangePasswordRequest, component?: CrudComponent): void {
    this.model.loading.set(true);

    this.dao.changePassword(body).subscribe({
      next: () => {
        this.model.loading.set(false);
        this.messages.publishSuccessMsg("passwordUpdated");
        component?.afterSave?.();
      },
      error: (err) => {
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorUpdatingPassword", err);
      },
    });
  }
}
