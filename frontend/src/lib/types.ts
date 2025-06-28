export type Review = {
  author: string;
  avatarUrl: string;
  rating: number;
  text: string;
  date: string;
};

export type Race = {
  id: string;
  name: string;
  latestRace?: boolean;
};
