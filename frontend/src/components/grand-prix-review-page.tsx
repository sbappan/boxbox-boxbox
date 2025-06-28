import React, { useState } from "react";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";
import { mockReviews } from "../lib/mock-data";
import type { Review } from "../lib/mock-data";

const GrandPrixReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  const handleAddReview = (review: Omit<Review, "date" | "avatarUrl">) => {
    const newReview: Review = {
      ...review,
      date: new Date().toISOString().split("T")[0],
      avatarUrl: `https://picsum.photos/seed/${Math.random()}/200`,
    };
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          Austrian Grand Prix 2025
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Share your experience and read what others thought!
        </p>
      </header>
      <ReviewForm onSubmit={handleAddReview} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default GrandPrixReviewPage;
