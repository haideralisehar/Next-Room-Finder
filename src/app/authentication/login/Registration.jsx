"use client";

import React, { useState } from "react";

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
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.agencyName.trim()) e.agencyName = "Agency name is required.";
    if (!form.agencyEmail.trim()) e.agencyEmail = "Agency email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.agencyEmail)) e.agencyEmail = "Enter a valid email.";
    if (!form.agencyPhone.trim()) e.agencyPhone = "Agency phone is required.";
    if (!form.agencyAddress.trim()) e.agencyAddress = "Agency address is required.";
    if (!form.agencyCR.trim()) e.agencyCR = "CR number is required.";
    if (!form.agencyCRExpiry) e.agencyCRExpiry = "CR expiry date is required.";
    if (!form.username.trim()) e.username = "Username is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
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
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    setSuccess(null);

    try {
      // Replace this fetch with your actual API endpoint.
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setSuccess({ message: 'Registration successful', data });
      setForm({
        agencyName: "",
        agencyEmail: "",
        agencyPhone: "",
        agencyAddress: "",
        agencyCR: "",
        agencyCRExpiry: "",
        username: "",
        password: "",
      });
    } catch (err) {
      setSuccess({ error: err.message || 'Failed to register' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">Agency Registration</h1>
        <p className="text-sm text-gray-500 mb-6">Fill in agency details and account credentials.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agency Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agency name*</label>
            <input
              name="agencyName"
              value={form.agencyName}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.agencyName ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="e.g. ABC Travels"
            />
            {errors.agencyName && <p className="text-xs text-red-500 mt-1">{errors.agencyName}</p>}
          </div>

          {/* Agency Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agency email*</label>
            <input
              name="agencyEmail"
              type="email"
              value={form.agencyEmail}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.agencyEmail ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="agency@domain.com"
            />
            {errors.agencyEmail && <p className="text-xs text-red-500 mt-1">{errors.agencyEmail}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agency phone*</label>
            <input
              name="agencyPhone"
              value={form.agencyPhone}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.agencyPhone ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="+92 300 1234567"
            />
            {errors.agencyPhone && <p className="text-xs text-red-500 mt-1">{errors.agencyPhone}</p>}
          </div>

          {/* CR Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agency CR number*</label>
            <input
              name="agencyCR"
              value={form.agencyCR}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.agencyCR ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Registration / CR number"
            />
            {errors.agencyCR && <p className="text-xs text-red-500 mt-1">{errors.agencyCR}</p>}
          </div>

          {/* CR Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CR expiry date*</label>
            <input
              name="agencyCRExpiry"
              type="date"
              value={form.agencyCRExpiry}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.agencyCRExpiry ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.agencyCRExpiry && <p className="text-xs text-red-500 mt-1">{errors.agencyCRExpiry}</p>}
          </div>

          {/* Address - full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Agency address*</label>
            <textarea
              name="agencyAddress"
              value={form.agencyAddress}
              onChange={handleChange}
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.agencyAddress ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Full office address"
            />
            {errors.agencyAddress && <p className="text-xs text-red-500 mt-1">{errors.agencyAddress}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.username ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Choose a username"
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 pr-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-3 py-1 rounded-md bg-gray-100 border"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Submit area - full width */}
          <div className="md:col-span-2 flex items-center justify-between mt-3">
            <div className="text-sm text-gray-500">* Required fields</div>
            <div className="flex items-center gap-3">
              {submitting && <div className="text-sm text-gray-600">Submitting...</div>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 disabled:opacity-60"
              >
                Register
              </button>
            </div>
          </div>
        </form>

        {/* success / error */}
        {success && (
          <div className={`mt-6 p-4 rounded-lg ${success.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>
            {success.error ? (
              <div>Failed to register: {success.error}</div>
            ) : (
              <div>{success.message}</div>
            )}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400">Built with TailwindCSS — responsive and accessible form layout.</div>
      </div>
    </div>
  );
}
