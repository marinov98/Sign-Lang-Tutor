export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  lessonsCompleted: number;
  stars: number;
  progress: any;
  dateJoined: string;
}

export interface UserContextState {
  auth?: IUser | null;
  authenticated: boolean | null;
  checkAuth: () => void;
  fillAuth: (user: IUser) => void;
}

