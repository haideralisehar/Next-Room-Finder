"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to home after 5 seconds
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-green-600 mx-auto mb-4"
          fill="none"
          viewBox="0 0 14 14"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h1>
        <p style={{color:"white"}}>
          Thank you! Your payment has been successfully processed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
