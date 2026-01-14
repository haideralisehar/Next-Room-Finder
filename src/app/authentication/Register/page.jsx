"use client";

import React, { useState, useRef, useEffect   } from "react";
import "../Register/RegistrationForm.css";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import SuccessSvg from "../../../lotti-img/upload.json";
import ErrorSvg from "../../../lotti-img/error.json";
import Image from "next/image";
import countryCodes from "../../static_data/countrycode";
export default function RegistrationForm() {
  const [form, setForm] = useState({
    username: "",
    countryCodes:"",
    password: "",
    agencyName: "",
    agencyEmail: "",
    agencyPhone: "",
    agencyAddress: "",
    agencyCR: "",
    agencyCRExpiry: "",
  });

  console.log(form);

  const [open, setOpen] = useState(false);
const dropdownRef = useRef(null);

const usa = countryCodes.find(c => c.code === "+1");

const [selectedCountry, setSelectedCountry] = useState(usa);

useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setisRegistering] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  // ✅ Validation function returning an object, not an array
  const validate = () => {
    const e = {};
    if (!selectedFile) {
    e.logo = "Agency logo is required.";
    alert("Hello");
    }
    
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

    const uploadImage = async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/pImage", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();
      console.log(data.imageUrl);
      return data.imageUrl;
    };

    try {
      setisRegistering(true);

      let imageUrl = "";

      /* ───── STEP 1: Upload image ───── */
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch {
          setError("Image upload failed. Profile not updated.");
          return;
        }
      }
      const payload = {
        ...form,
        logo: imageUrl,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Registration successful
        setSuccessPopup(true);
        setisRegistering(false);
        setForm({
          username: "",
          password: "",
          agencyName: "",
          agencyEmail: "",
          agencyPhone: "",
          agencyAddress: "",
          agencyCR: "",
          agencyCRExpiry: "",
          logo: "",
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
        setisRegistering(false);

        // Close popup after delay
        setTimeout(() => setIsShowError(false), 5000);
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please check your connection.");
      setIsShowError(true);
      setisRegistering(false);
      setTimeout(() => setIsShowError(false), 5000);
    } finally {
      setSubmitting(false);
      setisRegistering(false);
    }
  };

  // ✅ Handle file upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
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
       

        {isRegistering && (
          <div className="loading-container">
            <div className="box">
              <Image
                className="circular-left-right"
                src="/loading_ico.png"
                alt="Loading"
                width={200}
                height={200}
              />
              <p style={{ fontSize: "13px" }}>Please Wait...</p>
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
           <div>{error && <p className="errors-text">{error}</p>}</div>
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
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <img
                  src={
                    preview ||
                    "https://www.shutterstock.com/shutterstock/videos/3605058573/thumb/1.jpg?ip=x480"
                  }
                  onError={(e) => {
                    e.target.src =
                      "https://thumbs.dreamstime.com/b/gmail-logo-google-product-icon-logotype-editorial-vector-illustration-vinnitsa-ukraine-october-199405574.jpg";
                  }}
                  alt="Profile"
                  className="avatar-img"
                />
                <label htmlFor="profile-upload" className="edit-icon">
                  ✎
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  // disabled={loadings}
                  style={{ display: "none" }}
                />
              </div>
               {errors.logo && (
  <p className="text-xs text-red-500 mt-2 text-center">
    {errors.logo}
  </p>
)}
            </div>
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
           <div ref={dropdownRef}>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Agency Phone*
  </label>

  <div className="flex border border-gray-300 rounded-lg overflow-hidden  focus:ring-indigo-400">

    
    {/* Selected Country */}
    <div
      className="flex items-center gap-2 px-3 bg-gray-100 cursor-pointer"
      onClick={() => setOpen(prev => !prev)}
    >
      <img
        src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
        alt=""
      />
      <span>{selectedCountry.code}</span>
      <span>▾</span>
    </div>

    {/* Phone Number */}
    <input
      type="tel"
      maxLength={13}
      className="flex-1 px-3 py-2 focus:outline-indigo-400 "
      placeholder="Phone number"
      value={form.agencyPhone.replace(selectedCountry.code, "")}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        setForm(prev => ({
          ...prev,
          agencyPhone: selectedCountry.code + digits,
        }));
        setErrors(prev => ({ ...prev, agencyPhone: undefined }));
      }}
    />
  </div>

  {/* Dropdown */}
  {open && (
    <div className="absolute z-50 bg-gray-100 mt-1 rounded-lg  w-72 max-h-64 overflow-y-auto">
      {countryCodes.map((c) => (
        <div
          key={c.code}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            const numberOnly = form.agencyPhone.replace(selectedCountry.code, "");
            setSelectedCountry(c);
            setForm(prev => ({
              ...prev,
              agencyPhone: c.code + numberOnly,
            }));
            setOpen(false);
          }}
        >
          <img src={`https://flagcdn.com/w20/${c.iso}.png`} />
          <span className="font-medium">{c.code}</span>
          <span className="text-gray-600 text-sm">{c.name}</span>
        </div>
      ))}
    </div>
  )}

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
