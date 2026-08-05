export type UserRole = 'admin' | 'employee';

export interface UserModel {
  active: boolean;
  id: string;
  name: string;
  lastName: string;
  email: string;
  commission: number;
  role: UserRole;
  approved: boolean;
  specialty?: string;
  createdAt: Date;
}