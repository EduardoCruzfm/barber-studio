export type UserRole = 'admin' | 'employee';

export interface UserModel {
  active: boolean;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean;
  specialty?: string;
  createdAt: Date;
}