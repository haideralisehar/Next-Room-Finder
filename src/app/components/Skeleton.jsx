import React from "react";

export const TableSkeleton = () => {
  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "16px",
              padding: "16px 24px",
              borderBottom: "1px solid #f1f5f9",
              alignItems: "center",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                backgroundColor: "#e2e8f0",
                borderRadius: "50%",
              }}
            />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: 16,
                  width: "25%",
                  backgroundColor: "#e2e8f0",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  height: 12,
                  width: "50%",
                  backgroundColor: "#f1f5f9",
                  borderRadius: 6,
                }}
              />
            </div>

            <div
              style={{
                width: 96,
                height: 16,
                backgroundColor: "#e2e8f0",
                borderRadius: 6,
              }}
            />

            <div
              style={{
                width: 96,
                height: 16,
                backgroundColor: "#e2e8f0",
                borderRadius: 6,
              }}
            />

            <div
              style={{
                width: 80,
                height: 24,
                backgroundColor: "#e2e8f0",
                borderRadius: 999,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export const CardSkeleton = () => {
  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: 24,
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        <div
          style={{
            height: 12,
            width: "50%",
            backgroundColor: "#f1f5f9",
            borderRadius: 6,
          }}
        />

        <div
          style={{
            height: 32,
            width: "75%",
            backgroundColor: "#e2e8f0",
            borderRadius: 8,
          }}
        />
      </div>
    </>
  );
};
