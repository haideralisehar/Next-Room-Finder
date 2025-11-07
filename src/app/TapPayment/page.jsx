"use client";
import { useState } from "react";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const response = await fetch("/api/tap/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: 101,
        logId: 5001,
        amount: 100,
        customer: {
          firstName: "Dharmesh",
          lastName: "Chauhan",
          email: "webappfix.dev@gmail.com",
          phone: "9974690457",
        },
      }),
    });

    const data = await response.json();
    setLoading(false);
    if (data.url) {
      window.location.href = data.url; // Redirect to Tap Payment Page
    } else {
      alert("Error: " + JSON.stringify(data.error));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handlePay}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Pay Now"}
      </button>
    </div>
  );
}
