"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tap_id = searchParams.get("tap_id");

  const hasProcessed = useRef(false); // 🔒 Prevent double execution
  const [status, setStatus] = useState("processing"); 
  const [mesg, setmesg] = useState();
  // processing | success | error

  useEffect(() => {
    if (!tap_id) {
      setStatus("error");
      return;
    }

    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processWallet = async () => {
      try {
        const res = await fetch("/api/updatetopup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tap_id }),
        });

        const data = await res.json();

        if (!res.ok) {
  setStatus("error");
  setmesg(data?.message || data?.error);
  return;
}

if (!data.success) {
  setStatus("error");
  setmesg(data?.message);
  return;
}

setStatus("success");
setmesg(data?.message);


        setTimeout(() => {
          router.push("/");
        }, 10000);
      } catch (err) {
        console.error("Wallet update failed", err);
        setStatus("error");
      }
    };

    processWallet();
  }, [tap_id, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        
        {status === "processing" && (
          <>
            <h1 className="text-xl font-semibold text-gray-700 mb-2">
              Processing Payment...
            </h1>
            <p>Please wait while we update your wallet.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Payment Successful!
            </h1>
            <p>Your wallet has been updated successfully.</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Payment Issue
            </h1>
            <p>
              {mesg}
              We received your payment, but wallet update failed.
              Please contact support.
            </p>
          </>
        )}

        <button
          onClick={() => router.push("/")}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
