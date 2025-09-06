import BookingPage from "../booking/bookcontent"
import { Suspense } from "react";

export default function ResultsPage() {
  return(
    <Suspense>
    <BookingPage/>
    </Suspense>
  )
}
