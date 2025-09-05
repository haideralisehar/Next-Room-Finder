import ResultsContent from "./ResultsContent";
import { Suspense } from "react";

export default function ResultsPage() {
  <Suspense fallback={<p>Loading...</p>}>
      <ResultsContent />
    </Suspense>
}
