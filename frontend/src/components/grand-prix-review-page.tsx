import ReviewForm from "./review-form";
import ReviewList from "./review-list";
import { useReviews, useCreateReview } from "../lib/queries";
import { mockReviews } from "../lib/mock-data";
import type { Review } from "../lib/types";

const GrandPrixReviewPage = () => {
  // const { data: reviews, isLoading, error } = useReviews();
  const isLoading = false;
  const error = false;
  const reviews = mockReviews;
  const createReviewMutation = useCreateReview();

  const handleAddReview = (review: Omit<Review, "date" | "avatarUrl">) => {
    createReviewMutation.mutate(review);
  };

  // Show loading state
  if (isLoading) {
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
        <div className="flex justify-center items-center py-8">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Show error state with fallback to mock data
  if (error) {
    console.error("Failed to fetch reviews:", error);
  }

  // Use reviews from API or fallback to mock data if there's an error
  const displayReviews = reviews || mockReviews;

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          Austrian Grand Prix 2025
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Share your experience and read what others thought!
        </p>
        {error && (
          <p className="text-center text-amber-600 text-sm mt-1">
            Using offline data (backend unavailable)
          </p>
        )}
      </header>
      <ReviewForm
        onSubmit={handleAddReview}
        isSubmitting={createReviewMutation.isPending}
      />
      <ReviewList reviews={displayReviews} />
    </div>
  );
};

export default GrandPrixReviewPage;
