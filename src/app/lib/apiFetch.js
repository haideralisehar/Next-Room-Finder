// export async function apiFetch(url, options = {}) {
//   let response = await fetch(url, {
//     ...options,
//     credentials: "include",
//   });

//   // Access token still valid
//   if (response.status !== 401) return response;

//   // Try refresh token
//   const refreshRes = await fetch("/api/Auth/refresh", {
//     method: "POST",
//     credentials: "include",
//   });

//   // Refresh failed → logout
//   if (!refreshRes.ok) {
//     try {
//       await fetch("/api/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (e) {
//       // even if logout fails, force redirect
//       console.error("Logout failed", e);
//     }

//     window.location.href = "/authentication/login";
//     return;
//   }

//   // Refresh success → retry original request
//   return fetch(url, {
//     ...options,
//     credentials: "include",
//   });
// }



export async function apiFetch(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status !== 401) return res;

  // 🔁 refresh via Next API
  const refreshRes = await fetch("/api/Auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) {
    window.location.href = "/authentication/login";
    throw new Error("Session expired");
  }

  // retry original request
  return fetch(url, {
    ...options,
    credentials: "include",
  });
}
