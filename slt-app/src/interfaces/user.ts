export interface IUser {
  email: string
  firstName?: string;
  lastName?: string;
  password: string;
  lessonsCompleted?: number;
  stars?: number;
  progress?: any;
}
export interface UserContextState {
  auth?: IUser | null;
  authenticated: boolean | null;
  checkAuth: () => void;
  fillAuth: (user: IUser) => void;
}

