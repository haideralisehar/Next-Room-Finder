import ResultsContent from "../results/ResultsContent";
import { Suspense } from "react";

export default function ResultsPage() {
  return(
    <Suspense>
    <ResultsContent/>
    </Suspense>
  )
}
