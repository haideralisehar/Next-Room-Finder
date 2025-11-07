"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentFailure() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to home after 5 seconds
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-600 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Sorry, your payment could not be processed. Please try again.
        </p>
        <button
          onClick={() => router.push("/payment")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
