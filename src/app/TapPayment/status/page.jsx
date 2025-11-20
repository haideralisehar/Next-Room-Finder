import TapPaymentStatus from "../../TapPayment/status/statusmaker";
import { Suspense } from "react";

export default function ResultsPage() {
  return(
    <Suspense>
    <TapPaymentStatus/>
    </Suspense>
  )
}

