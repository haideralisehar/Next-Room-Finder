import CryptoJS from "crypto-js";

const SECRET_KEY = "CITYINBOOKING_2026_SECURE_KEY"; // keep this secret

export function encryptBookingId(bookingId) {
  return CryptoJS.AES.encrypt(
    bookingId.toString(),
    SECRET_KEY
  ).toString();
}

export function decryptBookingId(encrypted) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const original = bytes.toString(CryptoJS.enc.Utf8);
    return original || null;
  } catch {
    return null;
  }
}
