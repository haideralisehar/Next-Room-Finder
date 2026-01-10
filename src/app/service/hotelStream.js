
import {
  startSearch,
  setMeta,
  addBatch,
  searchDone,
  searchError,
  setdemandedRooms
} from "../redux/searchSlice";

// 1. Keep track of the controller outside the function to cancel previous requests
let activeAbortController = null;

export const performStreamingSearch = async (searchParams, dispatch, agencyId) => {
  // Cancel any ongoing search before starting a new one
  if (activeAbortController) {
    activeAbortController.abort();
  }

  activeAbortController = new AbortController();
  const { signal } = activeAbortController;
  

  const extr = {
    ...searchParams
    
  }

  dispatch(startSearch());
  

  try {
    const response = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Hotels/search-with-details-stream",
      {
        method: "POST",
        signal, // 2. Pass the signal to fetch
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(extr),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop();

      for (const event of events) {
        const lines = event.split("\n");
        let eventType = "";
        let dataLines = [];

        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventType = line.replace("event:", "").trim();
          }
          if (line.startsWith("data:")) {
            dataLines.push(line.replace("data:", "").trim());
          }
        }

        if (!dataLines.length) continue;

        let data;
        try {
          data = JSON.parse(dataLines.join(""));
        } catch (err) {
          console.error("JSON parse error:", err);
          continue;
        }

        switch (eventType) {
          case "meta":
            dispatch(setMeta(data));
            break;

          case "batch":

          
            // 1️⃣ Extract arrays safely
            const hotels = Array.isArray(data.Hotels) ? data.Hotels : [];
            const checkIn = data?.CheckInDate;
            const checkout = data?.CheckOutDate;
            const room = searchParams.room;

            const mergedBatch = hotels.map((hotel) => {
              const hotelId = String(hotel.HotelId);

              if (!hotel.Price || !hotel.Details) return null;

              return {
                hotelId,
                ...hotel.Details,     // full hotel info
                priceInfo: hotel.Price, // pricing kept separate (best practice)
                checkInDate: checkIn,
                checkOutDate: checkout
              };
            }).filter(Boolean);


            if (mergedBatch.length > 0) {
              dispatch(setdemandedRooms(room));
              dispatch(addBatch(mergedBatch));
            }
            break;

          case "done":
            dispatch(searchDone());
            break;

          case "error":
            dispatch(searchError(data?.message || "Streaming error"));
            break;

          default:
            break;
        }
      }
    }
  } catch (error) {
    // 4. Don't dispatch an error if the user manually cancelled the search
    if (error.name === "AbortError") {
      console.log("Search request was cancelled.");
      return;
    }
    dispatch(searchError(error.message));
    console.error("Streaming failed:", error);
  } finally {
    // Clear the controller reference if this specific request finished
    if (activeAbortController?.signal === signal) {
      activeAbortController = null;
    }
  }
};
