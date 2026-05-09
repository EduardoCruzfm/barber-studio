import { UserModel } from './user.model';

export class UserEntity {

  constructor(private user: UserModel) {}

  isAdmin(): boolean {
    return this.user.role === 'admin';
  }

  isApproved(): boolean {
    return this.user.approved;
  }

  canAccessApp(): boolean {
    return this.isApproved();
  }

  approve(): void {
    this.user.approved = true;
  }

  reject(): void {
    this.user.approved = false;
  }

  get data(): UserModel {
    return this.user;
  }
}