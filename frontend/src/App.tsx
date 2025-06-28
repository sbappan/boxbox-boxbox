import GrandPrixReviewPage from "./components/grand-prix-review-page";
import { ModeToggle } from "./components/ui/mode-toggle";

function App() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end p-4">
          <ModeToggle />
        </div>
        <GrandPrixReviewPage />
      </main>
    </div>
  );
}

export default App;
