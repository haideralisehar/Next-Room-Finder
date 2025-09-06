import HotelView from "../hotel-view/viewcontent"
import { Suspense } from "react";

export default function ResultsPage() {
  return(
    <Suspense>
    <HotelView/>
    </Suspense>
  )
}
