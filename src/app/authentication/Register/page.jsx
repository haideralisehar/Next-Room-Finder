"use client";

import React, { useState } from "react";
import "../Register/RegistrationForm.css";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import SuccessSvg from "../../../lotti-img/upload.json";
import ErrorSvg from "../../../lotti-img/error.json";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    agencyName: "",
    agencyEmail: "",
    agencyPhone: "",
    agencyAddress: "",
    agencyCR: "",
    agencyCRExpiry: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // ✅ Validation function returning an object, not an array
  const validate = () => {
    const e = {};
    if (!form.agencyName.trim()) e.agencyName = "Agency name is required.";
    if (!form.agencyEmail.trim()) e.agencyEmail = "Agency email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.agencyEmail))
      e.agencyEmail = "Enter a valid email address.";
    if (!form.agencyPhone.trim()) e.agencyPhone = "Agency phone is required.";
    if (!form.agencyAddress.trim())
      e.agencyAddress = "Agency address is required.";
    if (!form.agencyCR.trim()) e.agencyCR = "CR number is required.";
    if (!form.agencyCRExpiry) e.agencyCRExpiry = "CR expiry date is required.";
    if (!form.username.trim()) e.username = "Username is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Registration successful
        setSuccessPopup(true);
        setForm({
          username: "",
          password: "",
          agencyName: "",
          agencyEmail: "",
          agencyPhone: "",
          agencyAddress: "",
          agencyCR: "",
          agencyCRExpiry: "",
        });

        setTimeout(() => {
          setSuccessPopup(false);
          router.push("/authentication/login");
        }, 4000);
      } else {
        // ❌ Backend returned error
        const message =
          data?.message ||
          data?.error ||
          "An unexpected error occurred. Please try again.";
        setErrorMessage(message);
        setIsShowError(true);

        // Close popup after delay
        setTimeout(() => setIsShowError(false), 5000);
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please check your connection.");
      setIsShowError(true);
      setTimeout(() => setIsShowError(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative">
        {/* ✅ Success Popup */}
        {successPopup && (
          <div className="loading-overlay">
            <div className="loading-box-1">
              <Lottie className="loty-1" animationData={SuccessSvg} />
              <h4 style={{ fontWeight: "600" }}>Agency Created Successfully</h4>
            </div>
          </div>
        )}

        {/* ❌ Error Popup */}
        {isShowError && (
          <div className="loading-overlay">
            <div className="loading-box-1">
              <Lottie className="loty" animationData={ErrorSvg} />
              <h4 style={{ fontWeight: "600" }}>Error Occurred</h4>
              {errorMessage && (
                <p className="error-text text-red-600 mt-2 text-sm">
                  {errorMessage}
                </p>
              )}
              <button
                className="cls-err-btn mt-3"
                onClick={() => setIsShowError(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ✅ Registration Form */}
        <div className="max-w-4xl w-full bg-white rounded-2xl border border-solid border-[#e3e3e3] p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            Agency Registration
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Fill in your agency details and account credentials.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username*
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.username ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 pr-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    errors.password ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-3 py-1 rounded-md bg-gray-100 border"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Agency Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Name*
              </label>
              <input
                name="agencyName"
                value={form.agencyName}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.agencyName ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="e.g. ABC Travels"
              />
              {errors.agencyName && (
                <p className="text-xs text-red-500 mt-1">{errors.agencyName}</p>
              )}
            </div>

            {/* Agency Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Email*
              </label>
              <input
                name="agencyEmail"
                type="email"
                value={form.agencyEmail}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.agencyEmail ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="agency@domain.com"
              />
              {errors.agencyEmail && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.agencyEmail}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Phone*
              </label>
              <input
                name="agencyPhone"
                value={form.agencyPhone}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.agencyPhone ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="+92 300 1234567"
              />
              {errors.agencyPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.agencyPhone}
                </p>
              )}
            </div>

            {/* CR Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency CR Number*
              </label>
              <input
                name="agencyCR"
                value={form.agencyCR}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.agencyCR ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Registration / CR number"
              />
              {errors.agencyCR && (
                <p className="text-xs text-red-500 mt-1">{errors.agencyCR}</p>
              )}
            </div>

            {/* CR Expiry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CR Expiry Date*
              </label>
              <input
                name="agencyCRExpiry"
                type="date"
                value={form.agencyCRExpiry}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.agencyCRExpiry ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.agencyCRExpiry && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.agencyCRExpiry}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Address*
              </label>
              <textarea
                name="agencyAddress"
                value={form.agencyAddress}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.agencyAddress ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Full office address"
              />
              {errors.agencyAddress && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.agencyAddress}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex items-center justify-between mt-3">
              <div className="text-sm text-gray-500">* Required fields</div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center bg-[#00384d] hover:bg-[#004b66] text-white font-medium rounded-lg px-4 py-2 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
