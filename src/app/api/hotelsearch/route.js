export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const payload = await req.json();

    const upstream = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Hotels/search-with-details-stream",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    if (!upstream.body) {
      return new Response("No upstream stream", { status: 500 });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-transform",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
