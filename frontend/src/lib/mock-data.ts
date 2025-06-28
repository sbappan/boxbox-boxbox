export type Review = {
  author: string;
  avatarUrl: string;
  rating: number;
  text: string;
  date: string;
};

export const mockReviews: Review[] = [
  {
    author: "Jane Doe",
    avatarUrl: "https://picsum.photos/200/300?person=1",
    rating: 4,
    text: "The race was thrilling from start to finish! The atmosphere at the Red Bull Ring is always electric. Great organization.",
    date: "2025-07-01",
  },
  {
    author: "John Smith",
    avatarUrl: "https://picsum.photos/200/300?person=2",
    rating: 5,
    text: "An absolute masterpiece of a Grand Prix. We saw some incredible overtakes and a surprise winner. Can't wait for next year!",
    date: "2025-07-02",
  },
  {
    author: "Alice Johnson",
    avatarUrl: "https://picsum.photos/200/300?person=3",
    rating: 3,
    text: "It was a decent race, but the traffic getting to the circuit was a nightmare. The on-track action was good, but logistics could be improved.",
    date: "2025-07-02",
  },
];
