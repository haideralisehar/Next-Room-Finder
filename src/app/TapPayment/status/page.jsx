"use client";
import { useSearchParams } from "next/navigation";

export default function TapPaymentStatus() {
  const searchParams = useSearchParams();
  const rawData = searchParams.get("data");
  
  

  if (!rawData) return <p>No payment data found.</p>;

  let payment = {};
  try {
    payment = JSON.parse(rawData);
  } catch (e) {
    return <p>Error reading payment data.</p>;
  }

  const capturedAt = new Date(payment.transaction?.date.completed).toLocaleString("en-US", {
  hour12: false,
});

  return (
    <div style={{ padding: "30px" }}>
      <h2>Payment Status</h2>
      

      <p><strong>Status:</strong> {payment.status}</p>
      <p><strong>Charge ID:</strong> {payment.id}</p>
      
      <h3>Reference</h3>
      <p><strong>Transaction:</strong> {payment.reference?.transaction}</p>
      <p><strong>Order:</strong> {payment.reference?.order}</p>

      <h3>Customer</h3>
      <p>{payment.customer?.first_name} {payment.customer?.last_name}</p>
      <p>{payment.customer?.email}</p>

      <h3>Contact</h3>
      <p>{payment.customer.phone?.country_code}</p>
      <p>{payment.customer.phone?.number}</p>

      <h3>Amount</h3>
      <p>{payment.currency}</p>
      <p>{capturedAt}</p>
      <p>{payment.amount} </p>

      <details style={{ marginTop: "20px" }}>
        <summary>Full Raw Payment Data (JSON)</summary>
        <pre style={{ background: "#f5f5f5", padding: "15px" }}>
          {JSON.stringify(payment, null, 2)}
        </pre>
      </details>
    </div>
  );
}
