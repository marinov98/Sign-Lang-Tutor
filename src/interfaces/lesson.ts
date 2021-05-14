export interface ILesson {
  _id: string;
  userId: string;
  module: string;
  title: string;
  guide: string;
  starsAchieved: number;
  totalStars: number;
  completed: boolean;
}
