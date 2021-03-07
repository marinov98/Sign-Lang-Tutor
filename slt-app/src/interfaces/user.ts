export interface IUser {
  _id: string;
  email: string
  firstName: string;
  lastName: string;
  password?: string;
  lessonsCompleted: number;
  stars: number;
  progress: any;
  dataJoined: string;
}

export interface UserContextState {
  auth?: IUser | null;
  authenticated: boolean | null;
  checkAuth: () => void;
  fillAuth: (user: IUser) => void;
}

