export async function GET() {
  try {
    const response = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/dida/dictionary/latest",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch data from external API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(
      {
        success: true,
        message: "Types fetched successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
