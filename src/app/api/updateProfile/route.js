import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Read the form data from the frontend
    const formData = await req.formData();

    // Create a new FormData to forward to Azure API
    const azureFormData = new FormData();

    for (const [key, value] of formData.entries()) {
      azureFormData.append(key, value);
    }

    // ✅ Replace this with your Azure API endpoint
    const azureEndpoint =
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Users";

    // Send data to Azure API using PUT method
    const response = await fetch(azureEndpoint, {
      method: "PUT",
      body: azureFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to update profile on Azure" },
        { status: response.status }
      );
    }

    // ✅ Return successful response to frontend
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
