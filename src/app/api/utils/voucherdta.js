import CryptoJS from "crypto-js";

const SECRET_KEY = "y3478ty873y48ty"; // dev only
const SALT = "CITYINBOOKING@2026";

// Recursively add salt
function saltObject(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string" || typeof obj === "number") {
    return `${SALT}${obj}${SALT}`;
  }

  if (Array.isArray(obj)) {
    return obj.map(v => saltObject(v));
  }

  if (typeof obj === "object") {
    const o = {};
    for (const k in obj) {
      o[k] = saltObject(obj[k]);
    }
    return o;
  }

  return obj;
}

// Remove salt
function unsaltObject(obj) {
  if (typeof obj === "string") return obj.replaceAll(SALT, "");

  if (Array.isArray(obj)) return obj.map(v => unsaltObject(v));

  if (typeof obj === "object" && obj !== null) {
    const o = {};
    for (const k in obj) o[k] = unsaltObject(obj[k]);
    return o;
  }

  return obj;
}

// Encrypt full booking
export function encryptBookingObject(data) {
    const payload = {
    data,
    iat: Date.now(),               // issued at
    exp: Date.now() + 10 * 60 * 1000 // 10 minutes
  };
  const salted = saltObject(payload);
  const json = JSON.stringify(salted);

  return CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
}


export function decryptBookingObject(cipher) {
  try {
    if (!cipher || typeof cipher !== "string") return null;

    const cleaned = cipher.replace(/ /g, "+");

    const bytes = CryptoJS.AES.decrypt(cleaned, SECRET_KEY);
    const json = bytes.toString(CryptoJS.enc.Utf8);
    if (!json) return null;

    const salted = JSON.parse(json);
    const payload = unsaltObject(salted);

    // ⏰ Expiry check
    if (!payload.exp || Date.now() > payload.exp) {
      return null; // expired voucher
    }

    return payload.data;
  } catch {
    return null;
  }
}


